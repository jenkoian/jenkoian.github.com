---
layout: post
title: "I do WordPress now"
description: ""
category: wordpress
tags: [wordpress]
---
{% include JB/setup %}

> I do a lot, pretty much all my work in WordPress these days. This post talks about how that came about, what it’s like working with WordPress from a code point of view and the ecosystem. I discuss on things like the use of globals, composer support as well as things I really like, such as WP-CLI. I also touch on the community and finally on the direction I think WordPress is going and my thoughts on that. 
> 
> If you want a really succinct tl;dr it’s probably, I do WordPress and well, I like it.

From approximately 2012 - 2018 I was working predominantly, if not exclusively with [Symfony](https://symfony.com/). When we were pitching for a new e-commerce project in 2018 it therefore felt natural to reach for Symfony. I had used [Sylius](https://sylius.com/) a bit, and had high opinions of it, as did the people I spoke to about it too. Even if we went with a platform such as [Shopify](https://www.shopify.co.uk/), the APIs are so rich and Symfony’s tools for dealing with APIs so rich that this felt like not a problem too. Anyway, the pitch went really well and the client told us they were selecting us as their development partner for the project. Great news. 

> We want you to use WooCommerce.

We had looked into [WooCommerce](https://woocommerce.com/) as part of our analysis, but we had made the recommendation of Shopify and was fully expecting to go down that route. So WooCommerce it is! Since that point, I’ve pivoted pretty strongly to working predominantly, if not exclusively with WordPress. If you’re interested in more of the story of the project described above, you can check out the [talk I did at Bristol WP a few years ago](https://speakerdeck.com/jenkoian/from-zero-to-vip). For the remainder of this post though I want to talk about my experiences with WordPress over the last few years.

## Community
When first turning my focus to WordPress, I wanted to try and get a feel for the community a little bit. Luckily, there was a [local meet up](https://www.meetup.com/Cardiff-WordPress-Meetup/) happening mere days after discovering that I’d be working more with WordPress, so along me and a colleague went. 

It was a small, yet vibrant meet-up, what immediately stood out to me was how rich in diversity it was, not just in ethnicity and gender but also in age and ability. From professional developers who made their career in developing on WordPress to those less technical who just use WordPress to run their small business. It was certainly different to the tech meet-ups I’d attended previously and it was, well, lovely.

From there I attended another fairly local, but slightly bigger meet up, [Bristol WordPress People](https://wpbristol.co.uk/). Similar diversity, similar loveliness, really good food, like really good food. Sustainably sourced, all dietary needs met, you name it. So, a community that values..

* Diversity
* Sustainability
* Equity
* Good Food

Well, sign me up.

### WordCamp Europe
It would be remiss of me to talk about the WordPress community with out talking about an experience that I’ll remember for the rest of my life. In June of 2019 I attended my first WordCamp. [WordCamp Europe 2019 in Berlin](https://europe.wordcamp.org/2019/). 

I remember for years hearing about how WordCamps (and DrupalCons IIRC) are like these uber versions of conferences I’ve long been attending (Symfony Live’s and PHP Conferences mostly) but it wasn’t until experiencing one that I really knew what they meant. It was honestly incredible. I reckon even if you had little interest in WordPress you’d have a smashing time. Tons of sponsors offering activities and freebies, loads of people creating a nice atmosphere, lovely food, yoga classes, heck it even had a free creche!

<figure>
<img alt="Me with John Blackbourn @ WCEU 19" src="/assets/img/wceu19.jpg" />
<figcaption>Me hanging out with <a href="https://twitter.com/johnbillion" target="_blank">John Blackbourn</a> @ WCEU19</figcaption>
</figure>

The community knows how to party too, with the end of the event culminating in live entertainment and a big (80s themed) disco. So, reflecting on my points about the community again, we have:

* Diversity
* Sustainability
* Equity
* Good Food
* Knows how to party

Which funnily enough, would be my manifesto, should I ever move into politics. 

## The Codes
So I have to be honest, and I’m sure it comes of no surprise my impression coming into WordPress was that code quality was quite low. I was determined to keep an open mind and to keep any ego / elitism at the door though, which I think I have done, but I still think there are some observations to make. I’m going to touch on those now, I’m sure it’s nothing new to anyone who works with WordPress and I’ll touch on why this is likely the case later on too.

### The Bad

In a way I think WordPress is likely a victim of its own success. Built in an era where PHP was used [as a fractal of bad design](https://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/) it got so popular that it likely kept building and growing to the point it’s at today where it powers like 40% of the web or something. Over that time I think it’s fair to say it accrued quite a bit of technical debt without much in the way of payback.

Let’s just take a look at some of the things I found hard to deal with.

#### Globals...everywhere

I remember when I was first getting in to PHP (circa 2006) and one of the first things I learnt was to avoid globals like the plague. I wasn’t too sure why at the time if I’m honest but I’ve come to learn why over the years, among the many reasons is how hard it is to write tests, but more on that later.

#### Plugins

Plugins play a pivotal role in the world of WordPress, this isn’t necessarily a bad thing, but there are lots of them out there, and plenty of bad ones. I’m probably going to have this in the ‘The Good’ section (spoiler) but it’s here as well, purely due to the risk of a plugin completely breaking your site at any point, largely due to…

#### Hooksageddon 

WordPress has an extremely powerful extension system called hooks. There are two main types of hooks, filters and actions.

{% highlight php %}
<p>Hello <?php echo apply_filters( 'welcome_message_second_word', 'world' ); ?></p>
{% endhighlight %}

The above will output `Hello world` … or will it :notsureif: 

As there’s a hook (filter) around `world` it means any plugin/theme/project developer can change this value, e.g.:

{% highlight php %}
<?php
add_filter( 'welcome_message_second_word', fn( string $second_word ) => 'universe' );
{% endhighlight %}

So it will now say `Hello universe` … or will it :notsureif:

Unless of course a plugin uses the same hook with a higher priority. You can get around of course by changing your priority, or by adding some logic to only change it if the argument is a certain value or something, but, the point is, it can seem a little … wild, that at any point values can be changed multiple times by multiple plugins.

So that was a filter example, let’s have a look at an action:

{% highlight php %}
<p>Hello world</p>

<?php do_action( 'post_welcome_message_printed' ); ?>
{% endhighlight %}

Actions are more or less events, in the example above we’re essentially raising an event `post_welcome_message_printed` which plugins/themes/project developers can use to do … whatever they like - output a post welcome message template (maybe a gif or something), or send an email or, do some logging or whatever they want really. 

Similar concerns to the filter just slightly different in that it isn’t necessarily _changing_ a value, just performing an action. 

#### WP Query

Perhaps a little un-nuanced but `WP_Query` is horrific, I mean I’m sure it’s highly optimised and efficient and all that jazz, but just look at it 😱

[https://github.com/WordPress/WordPress/blob/25daf03a8ea95cf47b9f25ab40336a1f6501cff4/wp-includes/class-wp-query.php](https://github.com/WordPress/WordPress/blob/25daf03a8ea95cf47b9f25ab40336a1f6501cff4/wp-includes/class-wp-query.php)

If you look at `get_posts` specifically, then [this post from Tom J Nowell sums it up beautifully](https://tomjn.com/2013/08/12/wp_queryget_posts/).

#### Random other stuff

* Lack of namespaces which leads to best practices such as [https://developer.wordpress.org/plugins/plugin-basics/best-practices/#prefix-everything](https://developer.wordpress.org/plugins/plugin-basics/best-practices/#prefix-everything) (you can use namespaces I hasten to add, just that they aren’t completely ubiquitous)
* Lack of types which leads to functions returning things like `string|int|false` etc.
* Lack of unified autoloading which leads to loads of `require_once` calls or custom autoloaders all over the place
* Debugging can be difficult - particularly as you start stepping into hooks and things 

There’s probably other things too but I think you get the point.

### The Good

#### Extendability 

Ok, so the hook system can be problematic but it’s kinda cool you can customise almost anything! You have the power to turn WordPress into anything you want it to be, I think this is part of the reason WordPress has become so successful, particularly for agencies. 

#### Plugins

Related to the extendability, but there are plugins for almost anything, again you need to be _really_ careful to pick good ones, but you can really enhance the offering through plugins. [Multilingualpress](https://multilingualpress.org/) is a good example here, you get some really nice tools for providing a multilingual multisite with a relatively low footprint. 

#### Massive suite of functions

There is a huge number of utility and likewise functions in WordPress which come in really handy. One example that springs to mind is the HTTP functions, I saw [a good blog post on these recently over on DeliciousBrains](https://deliciousbrains.com/wordpress-http-api-requests/).

There are definitely others too, but this is a pretty neat example.

## The Ecosystem
WordPress is optimised for its users, not just the CMS but the entire ecosystem is user led, again another reason it’s likely so popular. This does make it challenging for a developer like me, particularly coming from Symfony which is very developer focussed. 

The WordPress ecosystem is focussed on empowering users of all abilities get up and running with a CMS or E-Commerce store, or whatever they want through ease of use. You want [a social media platform built on WordPress](https://buddypress.org/)? Sure, just upload this zip file!

Things which I’d come to take for granted to working with Symfony were no longer readily available. Let’s dig into some of that now.

### Git / Github

I love using Git and GitHub, it just feels so natural and easy to me. WordPress uses … Subversion and Trac, I used to use this too, a long time ago, and it was great at the time but things have moved on. There’s a strong element of ‘it works for them so why change?’ Going on, but I truly believe the WordPress ecosystem would gain so much if they moved wholesale to Git / GitHub. 

I should point out that WordPress _is_ on Github, you can submit a pull request however it won’t get merged:

> **Note:** Pull requests on GitHub will **not** be merged. Code changes are still required to be made to the SVN repository by trusted long term contributors granted commit access.
[https://make.wordpress.org/core/handbook/contribute/git/github-pull-requests-for-code-review/](https://make.wordpress.org/core/handbook/contribute/git/github-pull-requests-for-code-review/)

I don’t know how many contributors prefer GitHub over SVN but the fact they even have this an option suggests to me contributors at least would like to use Git/GitHub. 

The existing “SVN but you can use Github, but only kinda” is just convoluted, it makes it hard work to contribute, where do you even begin? Do you need to learn SVN? Why are there so many hoops compared to almost every other open source project out there?

I realise I’m fairly fresh to WordPress and maybe the current setup is like an old pair of slippers to the current core contributors, but this is my opinion looking at it with (fairly) fresh eyes.

### Coding standards

In a similar vein to the point above where WordPress seems to be different to the vast amount of other similar projects, this too rings true for the coding standards in WordPress. Again, I think they would benefit so much from adopting the standards adopted by the wider community. 

The wider PHP community has adopted PSR-1 and PSR-2 (now superseded by PSR-12) coding standards quite widely and for quite a while now, it just makes sense for WordPress to do the same? Or at least base their own standards from these, or at least just PSR-1. I’m not too familiar with the history but it seems it [was discussed years ago](https://core.trac.wordpress.org/ticket/23357), it made sense not to adopt given the support for PHP included 5.2 back then but I wonder if now given PHP 5.6 is the minimum supported version it might make sense?

It’s not too big a deal I guess, you quickly get used to tabs and extra spacing around brackets and stuff, but it just strikes me as yet another barrier for new contributors. Again though, the vast majority of existing contributors may not want to lose those comfy slippers, and I get that. 

### Composer

[Composer](https://getcomposer.org/) is by far the best thing to ever happen to PHP, heck, I’d argue it’s the best package manager there is. WordPress doesn’t have native support for composer, which again I think is a shame. There are some _excellent_ community tools out there though.

[WordPress Packagist](https://wpackagist.org/) mirrors all the plugins and themes listed on the WordPress directory and exposes them to composer through a custom packagist repository. It truly is fantastic, absolute hats off to [Outlandish](https://outlandish.com/), the company behind it. In the age of [mass WordPress acquisitions](https://poststatus.com/acquisitions/) I’m amazed Automattic haven’t acquired it. 

WPackagist makes it possible to install plugins and themes just as you would any composer package. WordPress plugins often come in premium flavours though which aren’t listed on the public directory and thus aren’t listed on WPackagist. Some of them (such as Yoast) offer up [custom repositories you can use for composer](https://yoast.com/help/how-to-install-yoast-plugins-using-composer/), but others do not. In this scenario, you have a few options such as [https://github.com/Rarst/release-belt](https://github.com/Rarst/release-belt) or [https://github.com/cedaro/satispress](https://github.com/cedaro/satispress) for example or you can set just include the plugins in your repository if all else fails.

### Dependency Injection

Coming from a Symfony background it was a bit of a shock to the system not having a [Dependency Injection Container](https://symfony.com/doc/current/components/dependency_injection.html) (DIC) at my disposal, everything in Symfony comes through the container pretty much. Singletons, where again much like globals you’re taught pretty early on ‘are bad mmmkay’ are quite common.

It is possible to use Dependency Injection (DI) and a DIC of course, as we have done on our [project skeleton we use in work](https://github.com/boxuk/wp-project-skeleton/blob/main/docs/dev/custom-code.md#dependency-injection), but as per composer and other things, it requires additional effort. 

### Testing

Unit Testing WordPress is hard work, mostly due to the way it relies so heavily on globals. The best way I’ve found around this is to wrap things heavily, so you can use DI for core functions and things and replace those with mocks in your tests. There is [WP_Mock](https://github.com/10up/wp_mock) too if you prefer to use a mocking framework.

Should we even bother unit testing? Possibly not, I like this quote from [Alain Schlesser](https://www.alainschlesser.com/) in the [Post Status](https://poststatus.com/) slack recently

> WordPress is like the toxic material you only can interact with through these protective barrier glasses with built-in gloves

So you probably want to unit test your custom code but find a way to decouple that from WordPress as much as possible so you don’t end up covered in toxic material. 

For those times where you want to test that your code is interacting with the WordPress bits ok, that’s where you’d want to move into integration testing.

There are some good libraries here. [WP PHPUnit](https://github.com/wp-phpunit/wp-phpunit) is good for providing factories and things to create data within your test, as well as to help with general test setup (installing WordPress etc.).

Beyond PHPUnit, you have [behat](https://docs.behat.org/en/latest/) which is used a fair bit in the community, [particularly by WP-CLI](https://github.com/wp-cli/wp-cli-tests). 

If you want to do more browser based testing, to ensure clicking buttons and things actually does what it’s supposed to, you should be able to use most/any UI testing framework, in work we’ve had some success with [Robot Framework](https://robotframework.org/) but more WordPress centric tools I’ve heard good things about include [WP Cypress](https://github.com/bigbite/wp-cypress)  and [Codeception with WP Browser](https://github.com/lucatume/wp-browser)

### WP-CLI

I’m not sure how long ago WordPress got WP-CLI but it is excellent. I’ve not dug too much into the internals, but I know using it is always a pleasure, it’s easy to extend and the (behat based) testing setup and tools are brilliant as well.

I’ve no idea how the WP-CLI was incepted and then executed but whoever was behind it deserves a lot of praise.

### WP Rest API

Similar to the WP-CLI, I’ve no idea when the Rest API aspect of WP was added, but again it’s excellent. The endpoints make sense, supports the necessary verbs as you might expect, is nicely queryable where it should be and is really easy to extend and customise. Once again, bravo.

### Other notable things

Some other notable ecosystem things I thought worth mentioning.

#### Dictator

Perhaps I’m biased because we use it heavily and have taken on the maintenance and development through our own fork, but I really think [Dictator](https://github.com/boxuk/dictator) is a nifty library. One thing I’m hoping to add at some point is the ability to run it in `pre_filter_` mode, so instead of replacing database values with the configuration set in the YAML file it will create the necessary `pre_filter_*` hooks instead. 

#### Flagpole

It’s a small little library just run by one guy, but [flagpole](https://github.com/jamesrwilliams/flagpole) is an excellent little feature flagging library in WordPress, we use it heavily at work and would recommend.

#### WP-CLI Fixtures

We used to run Alice fixtures in our Symfony projects in work, and we can do the same in WordPress thanks to a neat little WP-CLI package called [wp-cli-fixtures](https://github.com/nlemoine/wp-cli-fixtures). There are other solutions similar to this such as [FakerPress](https://en-gb.wordpress.org/plugins/fakerpress/) but I prefer YAML files for this sort of thing.

## Bringing PHP to a Javascript fight?
Almost everything I’ve talked about up until this point has been focussed on ‘classic’ WordPress or PHP centric WordPress, however there is a slow turning wheel that suggests that the future of WordPress is beyond PHP.

I think it started in 2015 where Matt Mullenweg suggested the community should [“Learn Javascript Deeply”](https://www.youtube.com/watch?v=KrZx4IY1IgU). Over 5 years since then, WordPress now has the [block editor](https://github.com/WordPress/gutenberg) built in [React](https://reactjs.org/), with [Full Site Editing](https://fullsiteediting.com/) just getting rolled out, which expands the use case of the block editor even further. The other big thing happening in WordPress right now is [Headless WordPress](https://www.gatsbyjs.com/docs/glossary/headless-wordpress/), with a [number](https://github.com/wpengine/faustjs) [of](https://frontity.org/) headless frameworks and approaches being pushed, all of which are Javascript based. 

There’s so much in WordPress that I can’t see PHP being eradicated from WordPress too soon, but it does feel like they are [strangling](https://www.boxuk.com/insight/minimal-disruption-maximum-gains-applying-the-strangler-pattern-to-legacy-software/) away classic WordPress and honestly, I can’t say I blame them.

I started off this post hinting at the massive amounts of tech debt that existed in WordPress and I’ve often [gone on about the virtues of strangling a legacy application](https://www.boxuk.com/insight/archived-from-legacy-to-new-the-anfield-approach/) that it makes sense? That’s not easy for me to say either given that I’m a PHP developer mostly. I’ve not used either the block editor or headless WordPress enough at this point to give a full opinion on either, but learning React has long been on my to-do list, so maybe this will provide the opportunity? Having said that, I would like to see a headless WordPress approach which isn’t Javascript based. I would like to see an approach using something like [Hotwire](https://hotwired.dev/) or [HTMX](https://htmx.org/) with a PHP backend. It makes me wonder if something like that would make it easier to use the wider plugin ecosystem in a headless setup. Again though, I’ve not used either of those technologies enough to give a firm opinion.  I do think it’s all very exciting though.

## Summary
Well this post was way longer than I expected, sorry about that. I realise I’ve ripped at WordPress a bit in places, but I hope that’s not the stand out element of this post. I was trying to be constructive in any criticism and I completely understand why the situation with a lot of these things is like it is. If anything, I want the summary of this post to be that, I like WordPress, I enjoy the community, I enjoy the power it enables in delighting the clients I work with, I enjoy the challenge of trying to bring best practice into it, I’m intrigued with the future direction, I’m hopeful I can eventually improve my React skills through the block editor and/or headless approaches. 

I feel like I’ve barely scratched the surface in what I’ve learnt from day zero until now of working with WordPress. On the face of it, I can understand why developers might be put off, but peel back some of the layers and I think you’d be surprised, there are good people doing good things in WordPress and there’s no reason that couldn’t be you. Oh and attend a WordCamp (when safe to do so) it will blow you away.
