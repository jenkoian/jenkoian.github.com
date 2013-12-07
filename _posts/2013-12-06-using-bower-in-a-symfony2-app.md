---
layout: post
title: "Using Bower in a Symfony2 app"
description: ""
category: symfony2
tags: [symfony2, php, bower, frontend]
---
{% include JB/setup %}

I've been hearing good things about [bower](http://bower.io) for a while now but never really had the chance to try it. So having recently started a new Symfony2 side project I thought I would take a look at integrating it. It turned out to be very very easy.

## Setting up

Well, obviously I needed to install it first. Pretty easy:

`npm install -g bower`

Cool. Next up I needed to create a `bower.json` file. This is basically `composer.json` for front end assets.

Bower has a nice interactive way of creating this file by simply running:

`bower init`

This will take you through each step of adding the necessary fields, much like the composer equivalent (`composer init` naturally).

Once I had done that, I had a bower.json file looking something like:

<script src="https://gist.github.com/jenkoian/7833778.js"> </script>

I won't go in to too much detail about how bower works, there is some pretty decent docs [on the website](http://bower.io) but essentially it is `composer` for your front end dependencies.

## Integrating bower with Symfony2

So how did I set this all up in a Symfony2 app? Well very easily, probably easy enough that it doesn't really require a blog post, but hey, I need to blog more and had some free time.

So my `bower.json` file I simply placed in the root of my project (right there alongside `composer.json`) then to get my front end assets, I simply needed to run:

`bower install`

Sweet, that was easy! Wait though, what is this `bower_components` nonsense. I could do without this littering the root of my project. Particularly as the standard in Symfony2 apps is to install front end assets in a `Resources/public` location.

I needed to tell bower to install my assets somewhere else. This was actually really easy too. I needed another file in the root of my project, this time a `.bowerrc` file. Here it is:

<script src="https://gist.github.com/jenkoian/7833818.js"> </script>

Pretty neat! 

I was a bit torn as to which was the correct directory for this. I ended up going with `src/Acme/Bundle/DemoBundle/Resources/public/vendor` in my main website bundle, but you may decide to put it in `app/Resources/public/vendor` or somewhere else altogether, i.e. YMMV.

So deleting that `bower_components` folder and running `bower install` again downloaded all the assets in the directory I was happy with. I then realised I wanted to include [bootstrap](http://getbootstrap.com) too. Rather than edit the `bower.json` though (although that would work) I simply ran:

`bower install bootstrap --save`

This works more or less exactly like `composer require`. It will install the dependency into your specified directory. The `--save` switch will ensure it will be added as a dependency to your `bower.json` also (I'm not sure why you *wouldn't* want this?!). You can specify a version, but if omitted the latest version will be assumed.

## Using your front end dependencies

So we have bower all set up, let's see how we include these things within our templates.

Well, pretty much just how you would include CSS/JS normally.

<script src="https://gist.github.com/jenkoian/7833806.js"> </script>

## Summing up

That's pretty much all there is too it. One thing that I was wondering about at first was the lack of `bower.lock` file or equivalent. Without this it means that you can't rely on libraries being the same versions on different environments (ok you can set exact version numbers, but still). This is a bit of a problem if you want to use bower in production as part of a deploy script for example. [There is some discussion on this](https://github.com/bower/bower/issues/505), but if this is an issue for you, you essentially have 3 options:

1. Use exact version numbers
2. Commit front end assets
3. Just accept the possibility of a variation in assets across environments


For my side project, option 3 is fine and I happily set the assets directory in my .gitignore file, but I do think a .lock file function is a must for bower going forward.

All in all though, I think bower is very nice. It does exactly for front end development what composer does for PHP development. It makes managing front end dependencies much much nicer. Hopefully gone are the days of downloading zip files and boshing into your web app.

## Going further

There is an interesting looking Symfony2 bundle for bower, called [SpBowerBundle](https://github.com/Spea/SpBowerBundle). I didn't use this in my case as I was after a simple solution and wanted to ensure I was learning about bower rather than a bundle. 

However, having taken a quick look, the bundle looks very nice. I can see it being particularly useful if you want to manage front end dependencies across multiple bundles. The assetic integration also looks good.

Finally, there was a recent discussion started about the state of the front end and Symfony2 which ultimately led to [this github issue](https://github.com/kriswallsmith/assetic/issues/529) so definitely worth keeping your eye on that if you're interested in this.

## Related links: 
[http://bower.io](http://bower.io)   
[http://williamdurand.fr/2012/12/24/being-a-frontend-developer-for-a-weekend/](http://williamdurand.fr/2012/12/24/being-a-frontend-developer-for-a-weekend/)   
[https://github.com/Spea/SpBowerBundle](https://github.com/Spea/SpBowerBundle)   