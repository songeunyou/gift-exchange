/*
Requirements:
One cannot receive a gift from the same person to whom they give a gift
"a gift" assuming only one gift is given and only one is received

Edge cases:
Exchange does not work with no people, single person, two people
What if there are duplicate names? Duplicate names ending with whitespace?
Do we want to randomize the names?
*/

// technically a valid solution, assumes no duplicate names in list of friends
function giftExchangeSimple(friends) {
  if (friends.length < 3) {
    console.log("Not enough friends")
    return
  }

  friends = friends + friends[0]

  for (let i = 0; i < friends.length - 1; i++) {
    console.log(friends[i] + " gives a gift to " + friends[i+1])
  }

  return
}
