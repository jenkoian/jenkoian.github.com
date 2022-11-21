---
layout: post
title: "Hacktoberfest checking out"
description: ""
category: hacktoberfest
tags: [hacktoberfest, opensource]
---
{% include JB/setup %}

The first [hacktoberfest](https://hacktoberfest.com/) I took part in was 2015, you can [read more about my experience on the blog of where I used to work](https://www.boxuk.com/insight/archived-hacktoberfest-2015/). It was pretty novel back then and it felt like every pull request was a very minor step in the progress of open source. One thing that was missing was an easy way to check your progress so you could see how close you actually were to claiming a free t-shirt. That's what gave me the idea to create a little checker app. It wasn't complicated, just a small node app that used the Github API to look up how many PRs a specific username had created during the qualifying period of October. Back then, the rules were pretty simple, open 4 PRs on Github in October and you've qualified. Spammers and scammers weren't so much around back then, so all the additional checks that are required nowadays weren't needed back then. 

![The initial basic design](https://github.com/jenkoian/hacktoberfest-checker/raw/version2016/hacktoberfest-checker-2016.png)

It got a little bit of interest from others taking part and I think it's fair to say for a small part of that 2015 edition at least it was _the_ way of checking your hacktoberfest progress. It was quite rewarding and exciting to lead a popular (popular being relative here, for me it was popular, I'm sure others it would barely be on their radar) open source project. One of the best aspects was seeing comments like [this one](https://github.com/jenkoian/hacktoberfest-checker/pull/7#issuecomment-148894994).

![](https://user-images.githubusercontent.com/131355/203045926-4b555987-9332-44cd-a549-42e60882f06e.png)

Year after year I updated the app with a fresh look and feel to match the underlying theme and I tried to introduce some new bit of technology each year, even if just a new CSS or JS framework so I could try and learn something new in the process. What started as an extremely simple node app with some basic front end JS and CSS is now a fully fledged [React](https://reactjs.org/) app usig [Tailwind CSS](https://tailwindcss.com/). The React rewrite is particularly worth calling out, as I had expressed an interested in rewriting the app in React and [someone submitted the most incredible PR](https://github.com/jenkoian/hacktoberfest-checker/pull/333) essentially doing all the work for me! It was great because it meant I could read through and understand the changes without undertaking the daunting task of having to start a big rewrite with no knowledge of React. Building upon this over the years has left me with a slightly above zero understanding of React, which is great.

The app started as an app hosted on the free tier on [Heroku](https://www.heroku.com/), this changed after a few years after I realised I was hosting this on a Digital Ocean competitor for an initiative organised by Digital Ocean. I reached out to them and they were only happy to give me some free credits to move over to [Digital Ocean](https://www.digitalocean.com/). The free credits ran out a year or two after than initial edition and although I'm sure they would have been more than happy to replenish them, I didn't want go back cap in hand so have been paying the hosting for the last couple of years. 

The cost isn't a big deal, a bit annoying given the economic state of the world at the moment, but it's not a massive amount. However, it's the maintenance, support and frankly the motivation of keeping the app running that has led me to decide that...

**The hacktoberfest checker has come to the end of it's life**

It's only a month a year, but when it came around this year I was actually dreading having to give up some of my free time to dedicate to it. It's not even that big of an upkeep, but still enough for it to become a distraction I could do without. 

The other aspect to this is that the app is more or less superfluous now anyway, worse than that it's not even accurate anymore. Digital Ocean has since built [it's own progress checker](https://hacktoberfest.com/profile/) and due to the spammers and scammers mentioned earlier have added more and more complexity to the rules, most of which we've added support for now, but some are extremely difficult/impossible, like Digital Ocean maintains a private list of repositories/users that are banned, also PRs have to be approved by Digital Ocean after a grace period which could be different for each PR, there's also a maintainers reward which seems to be manually picked by Digital Ocean which we obviousy can't add support for.

So although it was rewarding at first, the fact there is now a better and more accurate alternative, the fact I don't look forward to October coming and the fact I could save a bit of money, means that now is a good time. The repository on Github has over 700 stars, by far the most I've ever had on any other repository I've open sourced, to which I'm extremely grateful for and I'm chuffed that it helped a few people get into open source. The website will be offline, probably by the time you are reading this and I'll archive the repository. 

Cheers!