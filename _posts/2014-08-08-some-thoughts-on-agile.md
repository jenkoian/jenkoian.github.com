---
layout: post
title: "Some thoughts on Agile"
description: ""
category: opinion
tags: [opinion, agile, scrum]
---

## Some thoughts on Agile

I would in no way describe myself as an evangelist of Agile practices, I'm not a certified scrum master and I've never had any formal training or anything on Agile practices. However, over the last few years the company I've worked for has adopted an agile methodology and so I've had no choice but to have had some experience with Agile. Here are some of my thoughts on 'Agile', or working with 'Agility' or whatever the hell you wanna call it.

## Kanban and Scrum

It took me ages to work out what these terms exactly meant. I'm still not 100% sure, but this is my take.

Kanban I see as basically trello. You work from left to right in a production line type approach. So you'd still have user stories and possibly story points, although I don't think it's as important in Kanban and you'd basically move the stories or tickets through the pipe line, from (typically) to-do to done, via some variation of in-progress, merged and ready for testing. I basically see Kanban as a lightweight version of Scrum.

Scrum for me is the fuller version of Kanban. So you still have the board and the production line approach, but you split work up into sprints, work towards a velocity and plan and demo with the product owner in order to maintain focus on what the product will turn out like. Oh, you have daily 'scrums' which are basically stand ups where everyone gets updated. People put a lot of emphasis on this, but for me it's a minor detail. It just makes sense to catch up daily to update each other?

It's this Scrum approach I'm going to be talking most about in the rest of this post.

## User Stories are king

In my experience, the user stories are *the* most important part of the entire process. Without good user stories it makes it really difficult to estimate, get a good idea of velocity and deliver features ready to demonstrate.

User stories are difficult. When you read one, a good one, it will not appear that way. It will appear as almost too simplistic. Getting to that point however, can be very hard.

### What makes a good user story?

This is in my opinion what makes a user story a good one.

* Describes exactly what the feature should do.
* Should have no hard dependencies.
* Should have a list of Acceptance Criteria (AC).
* Should be short and concise.


Let's go into a bit more detail, with some example user stories.

A bad example:

*As a User I want to see notifications.*

A good example:

*As a logged in User, when I am on my dashboard I want to see a list of notifications at the top of the page.*

Let's break down this example.

*As a logged in User*

We specify that the User needs to be logged in at this point. If you have various Roles in your application it would make sense to include that in the story also, e.g. *As a logged in Editor*.

*when I am on my dashboard*

Now, this isn't perfect. The reason being that this indicates a dependency. What is dashboard? You are assuming in your story that there is a dashboard in place, and thus you can't work on this story until a dashboard has been created.

I think this kind of dependency, which I'd call a 'soft' dependency is inevitable. You will undoubtedly come up against situations like this. I think there are two things we can do to help here.

1. Be  mindful when planning that some tickets are undoubtedly going to need to come after others. Although avoid this if possible.
2. Allow user stories to have a Background. If anyone reading this (hi Mum!) has experience with BDD they will likely be familiar with features having a Background, which is basically where you set up the environment for the test. I see these kind of soft dependencies as similar. In our example, the Background would simply be: I have a dashboard in place.


*I want to see a list of notifications at the top of the page*

Again, this implies some kind of soft dependency, so the background for this ticket may be: There is a notification mechanism in place. The other questions surrounding this part of the story relate to the Acceptance Criteria. How should the notifications look? How many should there be? What determines the *top* of the page? These questions should all be answered within the AC for the story.

### Example of good Acceptance Criteria

* Notifications should appear in an unordered list.
* The list should appear at the top of the page, directly beneath the fixed menu.
* There should be a maximum of 5 notifications displayed.
* The text of the notifications should be black using the default font of the site.

You get the idea. The level of detail here is up to the product owner. Some may want complete control over their definition of done, down to pixel sizes and font styles. Others may simply be happy with something a bit more high level.

**The key point is that a good User Story can be understood by the developer and tested against by QA and the product owner/client.**

## Planning

I don't have too much to say on planning. I think if you have good user stories planning is a lot easier. Planning should be short and simple if you're doing it right. If your stories aren't good, then planning can end up taking a long time and be fairly painful.

Estimation can probably be seen as a part of planning. For my money the best way of estimating is affinity estimation. Whether you do this against the backlog at the beginning of the project or in planning at the beginning of each sprint, I don't think matters too much. I think it makes more sense to do it before each sprint as you will gain more insight of the product and your estimations are likely to be more realistic. However, I can understand that sometimes you need to do it before the project to get an idea of scope.

Planning is all about green fields, so try and have some fun with it if you can. Fun sprint names, a sense of competitiveness in increasing velocity are all ok in my eyes.

## It's all about the big game

For me, as a developer, the demo is *the* most important part of the entire process. It is your chance to show off to the product owner and/or client what you have done this sprint. As a keen Football (Soccer) fan I see this very much like the big game at the end of a week of rigorous training.

I think each sprint should be focussed on the demo. It is where you are shipping the features you've been working on. Take pride in this time slot you have, show off a little, be enthusiastic, encourage questions, engage with the audience. I've been into demo's embarrassed at how little there was to show, or worried that something is unfinished, worried it will undoubtedly break in front of an audience. I'm now firmly of the belief that if you find yourself in that situation, you're doing things wrong.

If you can't demonstrate something which you feel is good, working software then you're sprint has gone wrong. Perhaps you committed yourself to too much work which you couldn't deliver. Perhaps you're sprint period was too little, 2 weeks seem to be the norm but if you're features are too big, consider increasing this period? More likely, you're user stories were poor, which comes back to why User Stories are king.

## Retrospectives are vital

Sometimes when you feel there is a lot to do, it can be tempting to skip the retrospectives. It's often seen as a non mandatory part of the process where we all just pat ourselves on the back or if things haven't gone right, play the blame game. I disagree with this.

I think Retrospectives are vital in the health of an agile project. They highlight early where things are going wrong or where things are going right. They encourage communication amongst the team and can be quite bonding.

They should be fun and action focussed.

I would highly recommend taking a look at [plans-for-retrospectives.com](http://www.plans-for-retrospectives.com) for some ideas of fun 'games' you can play in your retrospective. We've bought some of the hard copies for the office and they've been brilliant. The best thing I like about them is that they're fun but very action focussed. So you don't just feel like you're wasting time gassing about the project, you're actually put down actions as to how to make things better.

## Jira is actually pretty great

It almost pains me to say it because it's so frickin expensive, but Jira is actually pretty great. Well, more accurately the Agile (formerly Greenhopper) plugin for Jira is great.

I think you could probably get a similar experience with something like Trello and a bit of admin work on your side, but Jira just makes it all fit together so nicely. It's the various reports, especially the burn down charts which I think are it's greatest features. It's really excellent, if you can afford it (and can work out the mental user roles management?!) then I would definitely recommend it.

## Conclusion

I have no real conclusions, just some of my thoughts on working Agile. My thoughts are changing all the time, but after a few years working in an Agile way, this is what I think works best.

I have a habit of waffling, so I hope this all makes sense, I can probably sum up with the following bullet points:

* User stories are king.
* Each sprint should focus on the demo, which for me is the most important part of the process.
* Retrospectives are important.
* Use Jira (if you can)


Of course, your experiences may be different, and I would love to hear about them.

{% include JB/setup %}
