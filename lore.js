import fetch from "node-fetch";

const loreMap = {
  Fahd: "Fahd is a one of the most sacred NPCs of league of legends. Notorious for his inting skills and dogshit mechanics, he is able consistently tilt amine regardless of what he does in the game, if he split pushes, amine rages why he didn't tp, and when he tps, amine flames his tp. This never ending cycle of toxicicity continues between these individuals who will never make it past plat 3.",
  Amine:
    "One of the most delusional players in the league of legends playerbase. He challenges the limits of toxicity. If hate speach wasn't bannable, he would a worldwide convicted criminal. Perfect example of what happens when women drink during pregnancy.",
  Omar: 'Mehdi\'s wet pussy gave birth to this individual(probably on a highway because that\'s where most accidents happen) only to become an Annie main. He later went to invent the phrases "dude this guy" and "where the fuck is my jungler", and became a yone/akshan main. He is the type of guy to type "ez" after losing a game.',
  Ayman:
    "If toxicity and faker had a child, Ayman would be toxicities father. He's generally a chill dude before he gets surprised as to why he died 1v5 in the enemy fountain. That said, you will probably not encounter the likes of Ayman in soloq as he doesn't play that much anymore.",
  Mehdi:
    "The only Janna main in the world who doesn't play Janna. He is known for his long in game afk sessions, followed by the classic \"hey I'm back\" 5 minutes before the game ends. People reach for the stars, Mehdi reaches for the nexus. Even in the custom aram games we play together, mehdi has successfully sweated in every single one of them without exception. Even when we say we are going to play troll champions, he still tryhards with his pick.",
  Samar:
    "Something is always missing with Samar, whether it be a mouse, internet, or a tooth. Although it may not be obvious, Samar does tilt even in custom 5v5s but has a strong enough mental to hold it in because as we all know, it is the healthiest way to dispose your anger.",
  Imane:
    "Incredibly underrated toplaner, definitely hire her in your team. However, she is generally a for fun player who doesn't tilt very often. If you want to chill in a draft game, or have 1 more slot open to complete a custom 5v5, Imane is the answer to your needs.",
  Chakib:
    "Professional KSer and inter. Unlike his brother Ayman, Chakib actually *laughs* when he plays against a broken champ. 7 year veteran, loves to fuck around the map and accomplish nothing. Inventor of the party bush. Although he does a lot of trolling, at times he miraculously pulls off the sickets jukes and combos anyone has ever seen. A true legend.",
  Nemika:
    "Nemika also referred to as Nems or Nemi, is the chillest person in the league of legends community. Never flames in chat, although sometimes plays clash with the squad. Relatively new member of the server that we shall welcome with open arms <3.",
  Dennis:
    "Previouslly referred to as Asked, or Axed for short, Dennis has the tendency to speak quickly and quietly. Makes quick straight to the point phrases to communicate with his team from the island of toplane which is necessary due to the modern goldfish attention span.",
  Yahia:
    "This meme lives inside a mosque. Sometimes I wonder if it's his father doing the Adan. He will quietly int your games and leave two of your teammates(Fahd and Chakib) argue their ass off over a dumb play *he* caused. However, he is still a super fun person to hang out with. In conclusion, if you ever get the chance to play with Yahia, don't.",
  Jihwan: "Samsung",
};

function parseToken(t){
	let lowerCase = t.toLowerCase();
	lowerCase[0] = lowerCase[0].toUpperCase();
	return lowerCase;
}

export function lore(tokens, message, client) {
  const champ = parseToken(tokens[0]);
  const loreMessage = loreMap[keyword];
  if (loreMessage) {
    message.channel.send(loreMessage);
  } else {
    fetch(
      `http://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/champion/${champ}.json`
    )
      .then((response) => response.json())
      .then((json) => {
        message.channel.send(json.data[champ].lore);
      })
      .catch((err) => {
        message.channel.send(
          "Can't find champion, try different spelling perhaps?"
        );
      });
  }
}
