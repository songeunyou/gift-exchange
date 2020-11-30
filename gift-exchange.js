/*
Requirements:
One cannot receive a gift from the same person to whom they give a gift
"a gift" assuming only one gift is given and only one is received

Edge cases:
Exchange does not work with no people, single person, two people
What if there are duplicate names? Duplicate names ending with whitespace?

Potential Features:
Randomize names
Email & Password -> receive notifications, view gift exchange partner
Limit number of participants
*/

// Part 1: SIMPLE gift exchange, technically a valid solution, assumes no duplicate names in list of friends
function giftExchangeSimple(friends) {
  if (friends.length < 3) {
    console.log("Not enough friends");
    return
  }

  const groupSize = participants.length - 1;
  for (let i = 0; i <= groupSize; i++) {
    console.log(participants[i] + " gives a gift to " + participants[i+1]);
  }
  console.log(participants[groupSize] + " gives a gift to " + participants[0]);

  return
}


/*
Part 2: Gift exchange intended to work with a proper sign up flow and backend
- Duplicate names prevented at signup
- Randomize list of names
*/

// frontend
function initiateGiftExchange(participants) {
  let params = {
    giftExchangeId: id
  }

  utils.get("https://gift-exchange.nylas.com/participants", params) // GET function to handle fetch with appropriate headers
    .then((res) => {
        if (res.status) {
          setParticipants({ participants: res.data.participants });
        }
      }
    }).catch((err) => {
      console.log(err);
    });

  const groupSize = participants.length - 1;
  for (let i = 0; i <= groupSize; i++) {
    console.log(participants[i] + " gives a gift to " + participants[i+1]);
  }
  console.log(participants[groupSize] + " gives a gift to " + participants[0]);

  return
}


// backend
var app = express();
app.get('/participants', (req, res) => {
  // check for request parameters
  let id = req.param('giftExchangeId');
  if (typeof id == 'undefined') {
    res.status(404).send({ error: 'No gift exchange ID provided' });
  }

  let [participants, err] = getParticipantsHandler(id);

  if (err) {
    // handle and return error messages
  }

  res.send(participants);
});

function getParticipantsHandler(id) {
  let [participants, err] = getParticipantsByGiftExchangeId(id);
  if (err) {
    return [null, err];
  }

  if (participants.length < 3) {
    return [null, "Not enough participants, invite some more"];
  }

  [participants, err] = randomize(participants);
  if (err) {
    return [null, err];
  }

  return [participants, null];
}

function randomize(participants) {
  return participants;
}
