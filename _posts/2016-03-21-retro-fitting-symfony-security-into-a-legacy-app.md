---
layout: post
title: "Retro fitting Symfony Security into a Legacy App"
description: ""
category: legacy
tags: [symfony, legacy, php]
---
{% include JB/setup %}

In [my last blog post](http://jenko.me/legacy/2016/02/03/an-escape-route-from-legacy-with-stackphp-and-the-symfony-microkernel/) I talked about how I had escaped legacy by leveraging the Symfony MicroKernel as well as the new Guard authentication component. Once this was all in place, my next task was to migrate the legacy, home-baked, role based access control to Symfony, so I could make extended use of [Symfony’s fantastic Security component](http://symfony.com/doc/current/book/security.html).

## Roles & Permissions

Having evaluated the current state of play with regards roles and permissions, I had determined that something akin to the following was at play:

|                | Add Content   |  Moderate Content | Edit User |
|----------------|:-------------:|:-----------------:|:---------:|
| ROLE_EDITOR    | x             |                   |           |
| ROLE_MODERATOR |               | x                 |           |
| ROLE_ADMIN     |               |                   | x         |

Now I knew which roles and permissions I needed to set up, there was going to be two ways in which I needed to protect the app. 

* Routes - stop users from seeing content should they navigate to a URL that is protected.

* Template - stop buttons etc... displaying if the user doesn’t have permissions to perform the action the button performs.

## Route protection

Securing routes in Symfony is actually quite easy. Just some basic configuration and that’s pretty much it!

<script src="https://gist.github.com/jenkoian/3f38b15298517f99e07b.js"></script>

However, in my scenario it wasn’t quite this easy. I needed to give the client a simple way to be able to tweak the permissions each role has. So for example, editors may be given the ability to  moderate content at some point. In most applications you’d probably say, just give the editor the  moderator role in that case, but due to the legacy nature and the fact there are many roles and permissions, simply giving a user an extra role, although possible, may be ill-advised. Therefore, the access control in my scenario needed to be something like the following:

<script src="https://gist.github.com/jenkoian/098695ae18feb8a5c67d.js"></script>

In other words, I needed the permissions to be mapped to the routes rather than the role. 

To achieve this I needed to use a custom RequestMatcher as described in this [excellent blog post from Mathias Nolback](http://php-and-symfony.matthiasnoback.nl/2012/07/symfony2-security-using-advanced-request-matchers-to-activate-firewalls/). For this to work I simply set up a static map of permissions to roles, I used a php array, but could just as easily be yaml, xml, whatever.

<script src="https://gist.github.com/jenkoian/5fda9fad505e12186bb5.js"></script>

My `RequestMatcher` then looked something like:

<script src="https://gist.github.com/jenkoian/e5c4d717b2cdb1d8bd97.js"></script>

Then as Nolback points out, this all gets configured via a compiler pass:

<script src="https://gist.github.com/jenkoian/bf5ff2c80179b0583285.js"></script>

With that in place the next thing to do was to write a custom  `PermissionUrlVoter` to vote on whether the user can access the route or not. As we’re not using roles anymore, the core `RoleVoter` will abstain from the vote so we need to make sure we have something in it’s place. Here is my custom voter:

<script src="https://gist.github.com/jenkoian/3d7810e8fba57006994b.js"></script>

`getConfigurationRoleMap()` basically extracts roles form a configuration file. The configuration file in question, looks something like:

<script src="https://gist.github.com/jenkoian/aa182c799aec96f30bed.js"></script>

This allows the client to easily see which permissions apply to which role(s) and, if you throw in a basic page with an [ace-editor](https://ace.c9.io/) on, make changes to. 

So all done on route protection right? Well, pretty much. As I have my Symfony application sat alongside the legacy application using [Stack](http://stackphp.com/), it basically attempts to hit the route in the Symfony app, if it encounters a `NotFoundException` falls back to the legacy application. The problem with this is that Symfony will forgo the security stuff completely if the route simply doesn’t exist in the Symfony app. The solution for this was relatively straight forward. Define a ‘catch all’ route in the Symfony app so that each request will get through the Symfony routing and into the Security system. It will of course throw a `NotFoundException` eventually when it realises there is no controller set up for the route.

<script src="https://gist.github.com/jenkoian/53ed3a789380d2b94015.js"></script>

This should go beneath any routes you currently have set up in the Symfony app so they continue to work as expected.

## Template protection

For the template protection, Symfony has a wonderful Twig extension which allows you to easily wrap things you want to protect, for example:

<script src="https://gist.github.com/jenkoian/ffe15e8d271e6b7877e1.js"></script>

In our Symfony application we can use this, with the caveat being that again we want to check permissions rather than roles, e.g.:

<script src="https://gist.github.com/jenkoian/b61c7a2dd30fd9381dd9.js"></script>

For this to work we require another custom voter:

<script src="https://gist.github.com/jenkoian/8f251a75ee55549a4b6f.js"></script>

This basically checks the users’ role, checks it against the configuration file and votes accordingly.

So now we have working template protection in the Symfony app, but how about the legacy app? Well, unfortunately it isn’t using Twig so we can’t use the nice Twig extension, nor does it know anything about the Symfony application at all, so we can’t easily grab things out of the container or anything. 

My solution was to create a static facade into the Symfony security bit that does the `is_granted` check. For this to work, I ended up having to use the (sorry mum) global keyword to expose the kernel to the legacy app.

<script src="https://gist.github.com/jenkoian/948437a9a5fa56824627.js"></script>

This allows us to use the following in the legacy code ‘templates’ and well just about anywhere we need to check permissions really:

<script src="https://gist.github.com/jenkoian/869a5e9848921a127801.js"></script>

## That’s it!

That’s pretty much it as to how I started using the extremely powerful Symfony security in the legacy application I’m working with. The roles and permissions are currently set and updated via a configuration file. The next step though, now that we have all our security features in the Symfony ecosystem would be to look to have some kind of ACL editor.

### Testing

One last thing I wanted to touch on is testing. 

[Symfony voters](http://symfony.com/doc/current/cookbook/security/voters.html) are quite easy to test, I’d recommend looking into [how some of the core voters are tested](https://github.com/symfony/symfony/blob/master/src/Symfony/Component/Security/Core/Tests/Authorization/Voter/RoleVoterTest.php) if interested in this. Ideally though, you’d have some functional tests which tested the routes that are protected before the security was migrated to the Symfony stuff, i.e. go to this page with this user and make sure you get a 403 response then try with this user and make sure you get a 200 response. 

Another neat thing you could do is use [Scientist](https://github.com/daylerees/scientist) to perform ‘experiments’ of this new security code against the existing ‘controlled’ code. This would allow you to ‘trial’ this new security code in production before rolling it out for real. It has things such as journals and reports to allow you to see how your new approach is working out, whether it’s performing in unexpected ways for instance or if it’s performing slower than it’s counterpart. 
