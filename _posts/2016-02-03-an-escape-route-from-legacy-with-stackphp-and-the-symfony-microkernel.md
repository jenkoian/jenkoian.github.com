---
layout: post
title: "An escape route from legacy with StackPHP and the Symfony MicroKernel"
description: ""
category: legacy
tags: [symfony, legacy, php]
---
{% include JB/setup %}


<em class="prologue">I came to, slightly dazed, I was cold and confused, where am I? I tried to take in my surroundings, reams of commented out code to my left, singletons to my right. I don’t know how I got here, but I knew at that point. I was. I was in legacy hell.</em>

Although developers generally want to always be working with the latest and greatest, the new shiny if you will, it can’t always be fresh daisies and green fields, every now and again, in fact, probably more often than not, developers have to deal with legacy code, i.e. code written in the past, either by an (*obviously inferior*) dev, or even worse themselves. 

Yep, legacy is some what of an occupational hazard. So when I had recently taken ownership of a particularly iniquitous legacy codebase, I wanted to steer clear of it as much as I could, poke it with a stick, give it snide looks, that kind of thing. So this is how I managed to work with modern tech whilst fighting this thankless battle.

## Using StackPHP to separate the old from the new

[StackPHP](http://stackphp.com/) is a convention for composing middlewares in PHP. It works with Symfony’s HttpKernelInterface and basically allows you to apply decorators to your application. This idea has become so popular in the PHP community that a [PSR standard has been adopted](http://www.php-fig.org/psr/psr-7/) with one of the aims to make it easier to build standardised middlewares. 

We can make use of this approach to easily split requests between a legacy codebase and something more modern, like a Symfony app. Carlos Buenosvinos wrote a brilliant blog post about this which is required reading if this post is proving of any interest: [http://carlosbuenosvinos.com/migrating-progressively-to-symfony-without-pain-with-stackphp/](http://carlosbuenosvinos.com/migrating-progressively-to-symfony-without-pain-with-stackphp/)

<script src="https://gist.github.com/jenkoian/641dcca3e47fc321825e.js"></script>


## Where the MicroKernel fits in

The legacy codebase I was dealing with was already large and convoluted with many directories and sub-directories. Adding in an app, a web, a src and whatever other directories seemed overkill and counter intuitive. I know that’s a minor detail and I could have just put them in a separate directory under the root and all probably would have been fine, but even so I wanted to bring in Symfony with the lowest foot print I could. 

Despite always being able to be used as a micro framework, Symfony formally introduced [‘Symfony as a Microframework’](http://symfony.com/blog/new-in-symfony-2-8-symfony-as-a-microframework) with a  new MicroKernel trait which allows you create an entire Symfony application from a single class. This fitted my use case perfectly, as it meant I could have a fully functional Symfony with minimal number of files. What was also really nice was that it could grow along with the development of the app. As I start to do more and more work in the Symfony part of the application the more of the framework I can use and the more files and directories I can create.

<script src="https://gist.github.com/jenkoian/6e00d8a8569ce4afa99f.js"></script>

So now I have this lightweight, small footprint Symfony app I needed it to fit in with the legacy app. To the user it should be transparent. On the whole this wasn’t too difficult, the main structure of the page was just HTML which I could just copy into some simple twig templates. The layout did have a few complicated bits though. Firstly, a global language switcher.

## Changing the locale across the entire app

As the existing legacy app already had a mechanism for setting and changing locale, we needed to hook into that in order to set the locale for our Symfony app. This was fairly trivial via a listener. 

<script src="https://gist.github.com/jenkoian/f79c6984eba54271d7b4.js"></script>

It’s worth noting here the importance of creating interface and adapters for everything we do with regards the legacy app (and in general really). By doing so we can quite easily swap out the implementation to something newer when we no longer need to support the legacy app. It’s also a great way of ensuring we can add tests without relying on legacy classes. It’s a good refactoring technique too, in his [seminal book on legacy](http://www.amazon.co.uk/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052), Michael Feathers refers to this as the ‘Extract Interface’ technique.

## Authenticating the user across the entire app

The last thing I needed to do was handle authentication. It needed to work seamlessly across both the legacy side of the application and the Symfony application.

The [security component](http://symfony.com/doc/current/book/security.html) within Symfony is super flexible but can be a complicated beast. Fortunately, some work was recently undertaken to simplify it a little and a new component called [‘Guard’](http://symfony.com/blog/new-in-symfony-2-8-guard-authentication-component) was created to help.

There is an excellent cookbook entry on [‘How to Create a Custom Authentication System with Guard’](http://symfony.com/doc/current/cookbook/security/guard-authentication.html) which gave me everything I needed. I was basically treating the legacy authentication system like a third party API in this case. It boils down to creating the following: A User class, a UserProvider class, and an Authenticator class. All is covered in excellent detail in the cookbook entry and the [docblock of the GuardAuthenticatorInterface](http://api.symfony.com/3.0/Symfony/Component/Security/Guard/GuardAuthenticatorInterface.html). Here’s mine.

<script src="https://gist.github.com/jenkoian/731628f51b1ea89002e9.js"></script>

<script src="https://gist.github.com/jenkoian/e66744a3af7125e5670f.js"></script>

<script src="https://gist.github.com/jenkoian/9dacbc175bf6fd163096.js"></script>

Most of it is self explanatory and explained well in the documentation. One thing to note for my use case is the following. 

<script src="https://gist.github.com/jenkoian/33e87298a93f5eb17f02.js"></script>

This is a simple method which maps roles from the existing authentication system to the new User class used by Symfony. This will ensure the user in Symfony land has the appropriate roles set and means you can make use of Symfony features such as [Voters](http://symfony.com/doc/current/cookbook/security/voters.html) and what not.  It means you can do things like `if is_granted(‘ROLE_MODERATOR’)` and also use the access control stuff which you can see in the security config in AppKernel.

So now we have all the elements for the Guard authentication it’s time to hook it all together with some basic config. Here is mine:

<script src="https://gist.github.com/jenkoian/e8a6d4f908c314e8c3f7.js"></script>

As you can see we have access to all the powerful features of the Symfony security component with only a few small classes and crucially, without making any changes to the existing codebase or functionality.

## Summing up

When faced with the original daunting task of taking on, maintaining and adding new features to this spaghetti bolognese of legacy code I was worried. Having used some OOP techniques and with help from a few nice PHP and Symfony libraries, I feel not only less worried about the future of this project but also enthused and, dare I say, excited to work on it.

Finally, I saw a tweet just before starting this piece of work which summed up perfectly what I was hoping to achieve and I think sums up this blog post perfectly as well.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">How do you make greenfield project with legacy? 1. pretend you&#39;re greenfield 2. write an adapter.</p>&mdash; Alberto Brandolini (@ziobrando) <a href="https://twitter.com/ziobrando/status/675305573127208960">December 11, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
