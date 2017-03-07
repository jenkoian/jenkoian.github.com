---
layout: post
title: "From Gaufrette to Flysystem and back again"
description: ""
category: legacy
tags: [symfony, legacy, php, filesystem, gaufrette, flysystem]
---
{% include JB/setup %}

When I saw [Gaufrette added a Flysystem adapter](https://github.com/KnpLabs/Gaufrette/pull/390) (a year ago to this day!) 
it somewhat captured my imagination and it seemed only right that [Flysystem should have a Gaufrette adapter](https://github.com/jenkoian/flysystem-gaufrette) and the two 
file-system abstraction layers could work completely bi-directional. 

It was mostly a bit of fun, although I could potentially see a use case even if that use case hadn't crept up on me yet.
**Until now!**

I recently worked on a legacy project which made use of [Gaufrette](https://github.com/KnpLabs/Gaufrette) and we were taking [my favourite approach to tackling legacy](https://twitter.com/ziobrando/status/675305573127208960).
We were working completely on new code and writing adapters to old stuff which handled a lot of the existing heavy
lifting. So, in the case of file-system abstraction we were writing an adapter to the old Gaufrette stuff, 
but due to a few reasons we were also keen on trying to make use of [Flysystem](https://github.com/thephpleague/flysystem). 
Then I remembered, this silly little library I had created!

*"You mean we could work with Flysystem whilst not having to rewrite all of these touch points with Gaufrette"*

We were using Symfony, so actually used [this bundle](https://github.com/1up-lab/OneupFlysystemBundle) to hook up Flysystem but essentially it just worked like this:

<script src="https://gist.github.com/jenkoian/b2c40bc307d30a4e398935382fb67812.js"></script>

Pretty neat! 

Obviously, having two file-system abstraction layers is a bit pointless, so eventually it would be nice to completely
move away from Gaufrette, but as a nice compromise to ease over the transition this came in really handy.

So if you're in a similar boat and want to transition from Gaufrette to Flysystem give my silly little library a try.

Finally, I'm not advocating that Flysystem is better than Gaufrette or anything, just that our needs for this particular 
project meant Flysystem was a better fit. They are equally as good as one another and I'm sure in some scenarios Gaufrette 
might have the edge. Indeed, if you wish to transition in the other direction you can always use the [Gaufrette Flysystem adapter](https://github.com/KnpLabs/Gaufrette/blob/master/doc/adapters/flysystem.md) :).




