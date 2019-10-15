document.addEventListener("DOMContentLoaded", function(event) { 
    var mql = window.matchMedia('(prefers-color-scheme: dark)');

    setColour(mql);

    function setColour(e) {
        var tweets = document.querySelectorAll('.twitter-tweet');
        
        if (e.matches) {
            tweets.forEach(tweet => {
                tweet.setAttribute('data-theme', 'dark');
            });            
        } else {
            tweets.forEach(tweet => {
                if (tweet.hasAttribute('data-theme')) {
                    tweet.removeAttribute('data-theme', 'dark');
                }
            });
        }
    }

    mql.addEventListener('change', setColour);
});