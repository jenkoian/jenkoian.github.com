---
layout: post
title: "Building a house with DDD"
description: ""
category: ddd
tags: [symfony2, ddd, bdd]
---

For the past, I dunno, year or so, I’ve been reading a lot about [Domain Driven Design (DDD)](http://en.wikipedia.org/wiki/Domain-driven_design) and even got to try it out on some projects. There are a number of resources which helped me out with this journey, but there are two stand out resources which really got me into it.

The first was [Ross Tuck’s excellent talk about Models & Service Layers](https://www.youtube.com/watch?v=ajhqScWECMo), if you haven’t watched it yet, then definitely, definitely do. This got me thinking about the tactical parts of DDD such as commands, handlers and [CQRS](http://martinfowler.com/bliki/CQRS.html).

Having opened up a journey into trying out this new approach, reading [red](http://www.amazon.co.uk/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577) and [blue](http://www.amazon.co.uk/gp/product/0321125215/ref=pd_lpo_sbs_dp_ss_1/277-9653975-7643565) books and basically being stoked about it all, along came an article from [Everzet](http://everzet.com/) called [‘Introducing Modelling by Example’](http://everzet.com/post/99045129766/introducing-modelling-by-example) which took my understanding one step further and helped me understand how BDD fits in with all this.

Everything seemed to be clicking into place and so I wanted to try it all out. See if this approach worked for me. So I came up with a silly example project to ‘Build a house with DDD’ - note: the title could easily have been ‘Build a house with Modelling by Example’ or ‘Build a house with BDD’ or even ‘Build a house with TDD’ ([as BDD is what TDD is supposed to be right](http://vimeo.com/68375232)).

## So here is how I built a house using DDD

*Note: I thought it’d be cool to do this commit by commit, give s a nice view of how each change was made etc. Unfortunately I only thought of this half way through writing it, so I am basically now the king of rebasing. Anyway, after I did this I came across [a similar project created by Everzet which takes a similar approach](https://github.com/MarcelloDuarte/pick-my-talks), it’s probably a better example of Modelling by Example (it was his thing after all!), although it doesn’t cover Command Handling etc. it’s __definitely__ worth checking out.*

[Version0](https://github.com/jenkoian/ddd-house/commit/ba1160626505e1f3a5df963bfa974178e6fc391d)

Here I set up a fresh Symfony install and added some libraries I thought I would be going to use via composer. With hindsight, this is completely the wrong approach. I started with the framework here because that's what I had been used to doing, but I actually don't need the framework until much later in the process. So the lesson here, don't do this. Don't set up the framework until you are ready to, if you are using a
framework at all of course. Start with your domain.

[Version1](https://github.com/jenkoian/ddd-house/commit/f5a95111f479785454cf6cf5b765ca20cb61475b)

Ignore the change to AppKernel which was again me thinking of the framework when I shouldn't have been.

I've added my first feature file. It contains some examples of how the feature 'navigating the house' would work. Looking back, I'm now thinking this should be broken up. So, enter the house is a feature and the scenarios should contain examples of that. Overall though, you get the idea.

This file is the kind of thing that would derive from the conversation with the client. No code, just language.

[Version2](https://github.com/jenkoian/ddd-house/commit/f3fc5150db91a0ad1be9d56eb8b0af72a48f0026)

The change to the behat.yml file is me just trying to tidy up, you can ignore that.

The changing of "outside the house" to "in the front garden" is just an example of me consolidating the language for consistency. I don't think this is always appropriate, the language is always primary. However, in some cases I think it can actually help the language to be more consistent on some things.

Finally, I've added a context file which implements `SnippetAcceptingContext` which means it can be used to generate some step definitions for me.

Once this is done, I run `bin/behat —append-snippets` to fill the context file with some template step definitions.

[Version3](https://github.com/jenkoian/ddd-house/commit/9abb0ec5c8d7918537ba84ed28b999798414aab4)

Here I start designing my model. The use of [Named Constructors](http://verraes.net/2014/06/named-constructors-in-php/) really helps here. It allows me to think purely about the domain at the interface level. This, for me, is where the true power of Modelling by Example is. It's BDD and indeed TDD in its truest form.

The fundamental thing to look at, is the language of the model and how it maps so directly the conversation with the client `$this->house->enterRoom($room)` etc. It's DDD at play, and is a big step forward to the `$this->house->setRoom($room)` I may have done in the past.

It also helps point out gaps in the initial story, considerations that haven't come up previously and thus making your model more resilient.

[Version4](https://github.com/jenkoian/ddd-house/commit/5661411bc0a6f5a0b942f9922150b045709be1c3)

This is the point where I move in a level to actually writing the domain models designed from [behat](http://behat.org). Here I use [PHPSpec](http://phpspec.net) to aid me in the creation of these models. The benefits of this is that it re-enforces that approach of designing through the interface, but it also ensures mistakes are caught and even more, it basically writes the models for you, with it's excellent interactive spec runner.

Finally (no pun intended) you may spot the use of final in front of the class names. I had seen this been used but wasn't really sure why, until I heard [Everzet's explanation of it at Symfony Live London 2014](https://www.youtube.com/watch?v=UIDlOV40xCY&list=PLo7mBDsRHu123EqX-kXnE2tLYXtdbVuzf#t=2871) and subsequently the [excellent blog post by Ocramius on when to use final](http://ocramius.github.io/blog/when-to-declare-classes-final/). I now see why using final is a great idea and it has even subsequently altered how I think when designing classes.

[Version5](https://github.com/jenkoian/ddd-house/commit/3dab522b244512d6fbfad70d27d947819d9c16b2)

Some further refactoring of the models basically following the Red -> Green -> Refactor loop at this point. Abstract Rooms and Gardens with Location. Why not just use Location altogether? Perhaps, but wanted to maintain the language. You don’t enter a Location as such, you enter a room or the garden.

[Version6](https://github.com/jenkoian/ddd-house/commit/bc7dc0840e634ab22475aee1d5b97a7ad5221427)

Further refactoring, add a way of entering rooms.

[Version7](https://github.com/jenkoian/ddd-house/commit/f68fd0975ead6a6a1177732491ed3d29ba021880)

I thought it would be neat to be able to enter a room from just a room name, as well as a Room object.

[Version8](https://github.com/jenkoian/ddd-house/commit/d125b4a7f5e2ab55ce0910c7c4bd1d240d336f68)

Adding a way of exiting a room. Notice it's very similar to entering a room but it's important that the language is maintained. We can tidy up the code re-use later, although as a side note I like [Mathias Verraes’ definition of DRY](http://verraes.net/2014/08/dry-is-about-knowledge/).

[Version9](https://github.com/jenkoian/ddd-house/commit/1cd52fe156bfd5a93118aac5348988d08142d028)

A minor change to the behat context to ensure room can be entered through their name.

[Version10](https://github.com/jenkoian/ddd-house/commit/56319d09ada9b9a08fe682d697a3973bf36d6bb2)

Here we add our first Value Object, Dimensions. Again, using PHPSpec as the crutch to aid the design. Dimensions is defined as a Value Object because it has no identity and is considered equal based on attributes of the class, in this case: width & height. Dimensions can be set on a location.

I found [Richard Millers post on Value Objects](http://richardmiller.co.uk/2014/11/06/value-objects/) good if you require more information about them have a read.

[Version11](https://github.com/jenkoian/ddd-house/commit/a81431f281b154644c0f899afb64ace67b74d50d)

What happens if we try and enter a room which doesn't exist? Let's add an exception for this.

It's important to note at this point that at all work between versions I’m running `bin/behat` and `bin/phpspec run` constantly and fixing any errors or discrepancies that may arise and using this whole process to shape the domain models.

[Version12](https://github.com/jenkoian/ddd-house/commit/802936f09a1c85c06c7b5b572f45d4e76b0b6b69)

Adding steps for checking dimensions and exits are available. These weren't explicit in our initial conversation but through working through the model and subsequent (ok fake in this case) conversations with the client it's now apparent that dimensions and exits are part of this model. In true DDD style, making the implicit, explicit.

[Version13](https://github.com/jenkoian/ddd-house/commit/50fce972753cab2f914a4569762bb4ba99d25b35)

Just removing a no longer required method. Red -> Green -> REFACTOR.

[Version14](https://github.com/jenkoian/ddd-house/commit/2712efbf1e3719b0295c3cc547176ad405beb262)

Just me tidying up the behat file. In this contrived example we aren't going to be doing anything special with potential buyers, so we can just get rid of this explicit context for now.

[Version15](https://github.com/jenkoian/ddd-house/commit/83cbbd8651af8514211d0c6198b9512e10cb5211)

One thing that was bothering me was how to exit a room. I didn't want to have circular references for example. So here I have a property of the previous location so we know where we've come from and a way of exiting to a room (notice we've tidied up that duplicated code from earlier too).

[Version16](https://github.com/jenkoian/ddd-house/commit/2355c7582e8260d7cb03401bfad48fcc30174fe6)

Allowing our Locations to have exits.

## A Raspberry Pi without the ports

Before I move on to the more tactical parts of DDD, let’s stop and think about what we’ve just done. At this point I’d consider the domain model to be quite complete. Of course it could evolve with further conversations with the client, but from what we know of the domain thus far, I think it’s pretty complete.

### So what do we have?

* A working domain model
* Created from the ubiquitous language
* High level behat stories and lower level PHPSpec tests proving it works
* We've not touched any framework code
* We've kept code to a minimum
* We're completely decoupled

We essentially have a *Raspberry Pi without any ports*.

![Raspberry Pi without any ports](https://dl.dropboxusercontent.com/u/2200349/dddhouse-blog-post/pi_bare.jpg)

If you think about [the clean architecture](http://blog.8thlight.com/uncle-bob/2012/08/13/the-clean-architecture.html) diagram below, we have our middle layer.

![Clean architecture](http://blog.8thlight.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)

It’s time now to work out from the middle into the other layers. So let’s add some ports onto our Raspberry Pi so we can connect it to something to make it useful.

[Version17](https://github.com/jenkoian/ddd-house/commit/60f9b70ab227785a5e503a4ed88c7da01d98adc9)

I've simply added two commands for entering rooms and exiting rooms at this point. These are two lightweight DTOs that will be used as a means of transferring messages from our framework into our domain.

[Version18](https://github.com/jenkoian/ddd-house/commit/e4ace656623d57cb78b6c8e5dc9b870b33ef4186)

A long with commands, I've identified an event, `EnteredRoomEvent`. This would ordinarily be done through some kind of event storming session with the client.

[Version19](https://github.com/jenkoian/ddd-house/commit/0952bb45115bb90786b0b685a0ce04de41cf7091)

So as you may have noticed I've been avoiding persistence throughout this. It's a small, simple, contrived example which I didn't want to muddy by adding any means of persistence. I realise this perhaps removes validity to the example, but I don't really care. This is more about how to model a domain with a modelling by example approach, as opposed to the intricacies of database persistence with DDD.

However, I did want a tidier way of dealing with the state of the House. Building the house in the constructor every time wasn't ideal. So I came up with this idea of a factory. Because we all know houses come from factories right? In essence it's more of a singleton, which works for me here. I'm still building the house on every request, but at least this does it in a clear and re-usable manner. It also doesn't get me bogged down in persistence when it's not my primary aim here.

The final thing to note is that I added some basic handlers to handle the commands I created earlier. These are likely to change but are fine for the time being.

[Version20](https://github.com/jenkoian/ddd-house/commit/b8ebbea1bf200e399661f252acc4aee9ff7d2da9)

Adding a Symfony bundle and some basic infrastructure.

Where I say in Version0 I shouldn’t have been adding the framework, it’s in this commit where I should have been.

Few things to point out here. Firstly, the lightweight controllers. They do little more than take the request, set up the command and pass it off to the handler.

When I first started this, I was very much of the mindset: decouple from the framework, controllers as services etc. I agree massively with decouple from the framework with regards the domain and even the ports layer (commands/handlers) but, [similar to what Dave mentions in ‘that podcast’ episode 10](http://thatpodcast.io/episodes/episode-10-the-one-with-the-best-practices/), I've come a little full circle in the controllers as services and using DI to completely decouple your controllers. I now feel, it doesn't really matter. So long as your controllers are really light, it doesn't really matter if they're tightly coupled, because essentially they don't matter. They are merely passing messages from framework to domain. The second point to note is that you can see from the images and twig templates how advanced my UI is going to be :).

[Version21](https://github.com/jenkoian/ddd-house/commit/73bb68c1d9fe6a9d125191b3e535af3fb1165c09)

Adding exits and dimensions to rooms for a fuller experience.

[Version22](https://github.com/jenkoian/ddd-house/commit/2c2ec90ebf0d55b5bf30366df99a1dfd31e14077)

The main thing I did in this commit was to add an event dispatcher. I throw a domain event in my model when entering a room and needed the dispatcher in place to support that.

As I am using Symfony it made sense to me to use the Symfony event dispatcher. However, it is a bit of a pain because it expects an event to have a name and to be of type `Symfony\Component\EventDispatcher\Event`. As I was trying to follow the clean architecture and have no outer dependencies I didn't want to have my event extend `Symfony\Component\EventDispatcher\Event`.

Therefore, I needed to create an adapter. Going back to the Raspberry Pi analogy made in a previous version. I needed a Serial to USB adapter, or something like that. I’m starting to add some ports on to my Pi.

![Raspberry Pi with ports](https://dl.dropboxusercontent.com/u/2200349/dddhouse-blog-post/pi_ports.jpg)

I also wanted to use my own Dispatcher interface, because what if I wanted to stop using the Symfony dispatcher and replace it with something else? I want to be able to continue using the same interface but just add a new adapter and change my DI. I want to be decoupled.

You can see how I achieved this from the code within this commit. Finally, I added a `HandlerInterface` so that I can swap out handlers using DI should I need to also.

[Version23](https://github.com/jenkoian/ddd-house/commit/dcb675d273260b6a9e0af7948a26945ca2605a01)

Adding an event subscriber to log when a room is entered.

I again used the adapter approach and created my own interface for logging/event subscribing. I then have an adapter for example using PSRLogger which is easily replaceable should I need to.

[Version24](https://github.com/jenkoian/ddd-house/commit/4fdc5ed94368ef1656ea80e6fde634a58020cc04)

To show off the benefits of decoupling domain from the framework I wanted to show an example of how the domain could be used outside the browser, so I thought it'd be cool to set up a quick CLI example.

Symfony makes it trivial to add CLI programs, and you can see from this commit how exactly it works. Essentially it's the same deal as controllers. Request in -> Create command -> Pass off
to Handler.

![CLI version of the house](https://dl.dropboxusercontent.com/u/2200349/dddhouse-blog-post/dddhouse-cli.gif)

[Version25](https://github.com/jenkoian/ddd-house/commit/a9ca03a9d882cf03d1e8ca48f17f9780a62ec1f5)

Adding a command bus and separate out command handling from domain.

If you’re unsure what a command is or does, [I’d recommend Shawn McCools excellent post on them](http://shawnmc.cool/command-bus).

After initially considering [CommanderBundle](https://github.com/tabbi89/CommanderBundle) I eventually opted for [SimpleBus](https://github.com/SimpleBus) because I liked the simplicity and have a lot of respect for it's maintainer Mathias. I did have [some misgivings over the use of a type hint for commands](https://github.com/SimpleBus/CommandBus/pull/2), but generally it suited what I needed to do well, it also forced me to create an explicit CommandHandling layer, which I think works quite well. It's been completely changed in version 2 now anyway, and is [more of a generic 'MessageBus' now](https://github.com/SimpleBus/MessageBus).

There are quite a few command buses that have popped up recently, I created [CommandBusCommandBus](https://github.com/jenkoian/CommandBusCommandBus) as a case in point. To be honest with you though, the command bus is a really simple concept and you may even be better off just rolling your own if you don’t need anything fancy. The main reason I went with Simple Bus was because it [hooked into Symfony quite nicely](https://github.com/SimpleBus/SymfonyBridge).

Anyway the point is I wanted to introduce a command bus to make my example complete.

Here you can see how I've moved all the command handling bits to the CommandHandling layer (or ports layer as I’ve heard Ian Cooper describe it) I spoke about above. It just means that rather than passing command to handlers directly, I can just 'throw' them on to the command bus now. This has the advantages of being able to decorate the command bus to be able to perform additional tasks against commands should I want to; I can make the command bus handle commands asynchronously should I choose; plus other niceties that arise when delegating message handling in this way.

## …and we’re done!

You can check out the crib on heroku: [http://dddhouse.herokuapp.com](http://dddhouse.herokuapp.com)

You may have guessed from the code but that is indeed the Home Alone house.

Ok, it’s not going to win any design awards, but with a bit of imagination you can perhaps picture some interactive JS whizzy interface which allows you to hover over doors and enter rooms in a fun way.

## So let’s recap what we’ve done

* Created our core domain using Modelling by Example/BDD/TDD
* Worked our way out from the middle
* Identified our use cases (commands)
* Created our infrastructure
* Added ports into our domain
* Created adapters to plug our infrastructure into our domain
* Created a working application

We’ve gone from components to a Raspberry Pi logic board, to a Raspberry Pi with Ports, to a Raspberry Pi with a case - the next step would be to a Raspberry Pi with a fancy case (the JS whizzy version I alluded to above).

![Raspberry Pi Cycle](https://dl.dropboxusercontent.com/u/2200349/dddhouse-blog-post/pi_cycle.png)

## Where do we go from here?

One thing I haven’t tackled yet is end-to-end testing, or acceptance testing.

For a while, at work, I’ve often thought we were missing a trick in how QA is integrated with development. In that, it isn’t really. It all feels a little ‘thrown over the wall’. Although, I’ve not done anything with regards this at the time of writing I have a few ideas off the back of this as to how to integrate them closer. I’ll use another post to go in to details, but I’m thinking QA could be involved in the initial feature writing (Given/When/Then). Then when it comes to acceptance testing, they write their automated scripts using [Watir](http://watir.com/) (what they currently use anyway) and [Cucumber](http://cukes.info/) but re-using the feature files developed for creating our domain.

So I’m quite keen to give that a go, maybe using the house as a nice example application, or perhaps starting a new internal application. Either way, I’m quite stoked about the possibilities.

## Conclusion

Theoretically I was a big fan of this approach and practically it hasn’t altered my view. My domain seems so much more concise, and uses the ubiquitous language in a substantial way. It’s made a number of concepts click for me. Take TDD for example, I’d often liked the idea but didn’t truly understand it. I’d taken a test first approach before, but wasn’t that sold on it. However, this subtle difference in approach to TDD has unlocked it’s power for me. I now think, through a combination of [the excellent talk by Ian Cooper](http://vimeo.com/68375232), and this Modelling by Example approach that I ‘get TDD’. It’s about design, not about testing.

What I have learned through taking this approach is how DDD can really work for me. Not just the tactical parts either. I feel I now have a better understanding of how to turn conversations directly into code; How to design aggregates around entities and value objects and how to use ports and adapters to ensure decoupling.

Ok, my example is small and contrived but it’s been enough to expose me to a practical use of these approaches. I’m left with little doubt that this could work on larger projects and have indeed started using it on larger, albeit internal at the moment, projects and have to say it brings everything together quite nicely.

A silver bullet I’m sure this is not, but I can imagine this kind of thing to work in lots of scenarios. It reduces complexity to the point I can see paths forward in projects where before I may have been scratching my head.

Finally, the other brilliant thing about all this is the excellent community behind it. The PHP community has really embraced DDD and has really been pushing some of the ideas, but also people like Ian Cooper and Greg Young from the .NET world have become a huge source of inspiration for me.

{% include JB/setup %}
