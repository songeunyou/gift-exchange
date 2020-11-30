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

// V1: SIMPLE gift exchange, technically a valid solution, assumes no duplicate names in list of friends
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
V2: Gift exchange intended to work with a proper sign up flow and backend
- Duplicate names prevented at signup
- Randomize list of names in backend
*/

// FRONTEND
function initiateGiftExchange() {
  let params = {
    giftExchangeId: id
  }

  utils.get("https://gift-exchange.nylas.com/participants", params) // GET function to handle fetch with appropriate headers
    .then((res) => {
      // set participants
    }).catch( /* handle error */ );

  const groupSize = participants.length - 1;
  for (let i = 0; i <= groupSize; i++) {
    console.log(participants[i] + " gives a gift to " + participants[i+1]);
  }
  console.log(participants[groupSize] + " gives a gift to " + participants[0]);

  return
}

// BACKEND
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

function randomize(participants) { // should have additional endpoint to save your list if you are happy with the randomization
  let index = participants.length - 1;

  while (index >= 0) {
    let randomIndex = Math.floor(Math.random() * index);

    let swapValue = participants[randomIndex];
    participants[randomIndex] = participants[index]
    participants[index] = swapValue;

    index--;
  }

  return [participants, null];
}

/*
V2 Sign Up requires:
- Email to handle gift exchange notifications, updates, initial email about who you are gifting to
- "nickname" check to ensure no duplicates if multiple participants have the same name
*/

// triggers on form submission
function handleSignUp(event) {
  event.preventDefault();

  if (submitEnabled && validateInput()) {
    // validateInput checks for alphanumeric nickname (no whitespaces or underscores), valid password, valid email format
    // handle input sanitization in backend
    let params = {
      giftExchangeId: id,
      nickname: nickname.toLowerCase(),
      email: email.toLowerCase(),
      pwd: password
    };

    utils.post("https://gift-exchange.nylas.com/signup", params) // POST function to handle fetch with appropriate headers
      .then(res => {
        if (res.status) {
          setSubmitSuccess(true);

          if (res.isRegistered) {
            setEmailErrors("This email is already registered.");
          }

          else if (!res.isRegistered && res.nicknameExists) {
            setNicknameErrors("This nickname is taken! Choose a different one.");
          }
        } else {
            throw "Something went wrong."
        }
      }).catch(err => {
        console.log(err);
        setSubmitEnabled(true);
        setErrors("Something went wrong. Please try again later.");
      });
  }
}
