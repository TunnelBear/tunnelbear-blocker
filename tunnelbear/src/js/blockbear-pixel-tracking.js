(function () {
    
    // from PixelBlock
    
    var proxyPattern = 'googleusercontent.com/proxy';
    var imgSafe = '?blockbear=img-safe#';

    var blacklist = [
        {name:'HubSpot',        pattern:'t.signaux',               url:'http://getsidekick.com'},
        {name:'HubSpot',        pattern:'t.senal',                 url:'http://getsidekick.com'},
        {name:'HubSpot',        pattern:'t.sidekickopen',          url:'http://getsidekick.com'},
        {name:'HubSpot',        pattern:'t.sigopn',                url:'http://getsidekick.com'},
        {name:'Banana Tag',     pattern:'bl-1.com',                url:'http://bananatag.com'},
        {name:'Boomerang',      pattern:'mailstat.us/tr',          url:'http://boomeranggmail.com'},
        {name:'Cirrus Inisght', pattern:'tracking.cirrusinsight.com', url:'http://cirrusinsight.com'},
        {name:'Customer.io ',   pattern:'track.customer.io/e/o',   url:'http://customer.io'},
        {name:'Yesware',        pattern:'app.yesware.com',         url:'http://yesware.com'},
        {name:'Yesware',        pattern:'t.yesware.com',           url:'http://yesware.com'},
        {name:'Streak',         pattern:'mailfoogae.appspot.com',  url:'http://streak.com'},
        {name:'LaunchBit',      pattern:'launchbit.com/taz-pixel', url:'http://launchbit.com'},
        {name:'MailChimp',      pattern:'list-manage.com/track',   url:'http://mailchimp.com'},
        {name:'Postmark',       pattern:'cmail1.com/t',            url:'http://postmarkapp.com'},
        {name:'iContact',       pattern:'click.icptrack.com/icp/', url:'http://icontact.com'},
        {name:'Infusionsoft',   pattern:'infusionsoft.com/app/emailOpened',  url:'http://infusionsoft.com'},
        {name:'Intercom',       pattern:'via.intercom.io/o',       url:'http://intercom.com'},
        {name:'Intercom',       pattern:'intercom-mail-100.com/o', url:'http://intercom.com'},
        {name:'Mandrill',       pattern:'mandrillapp.com/track',   url:'http://mandrillapp.com'},
        {name:'Hubspot',        pattern:'t.hsms06.com',            url:'http://hubspot.com'},
        {name:'RelateIQ',       pattern:'app.relateiq.com/t.png',  url:'http://relateiq.com'},
        {name:'RJ Metrics',     pattern:'go.rjmetrics.com',        url:'http://rjmetrics.com'},
        {name:'Mixpanel',       pattern:'api.mixpanel.com/track',  url:'http://mixpanel.com'},
        {name:'Front App',      pattern:'web.frontapp.com/api',    url:'http://frontapp.com'},
        {name:'Mailtrack.io',   pattern:'mailtrack.io/trace',      url:'http://mailtrack.io'},
        {name:'ToutApp',        pattern:'go.toutapp.com',          url:'http://toutapp.com'},
        {name:'Outreach',       pattern:'app.outreach.io',         url:'http://outreach.io'},
        {name:'Outreach',       pattern:'outrch.com/api/mailings/opened', url:'http://outreach.io'},
        {name:'Mixmax',         pattern:'track.mixmax.com/api',    url:'http://mixmax.com'},
        {name:'Mixmax',         pattern:'email.mixmax.com/e/o',    url:'http://mixmax.com'},
        {name:'SendGrid',       pattern:'sendgrid.net/wf/open',    url:'http://sendgrid.com'},
        {name:'ExactTarget',    pattern:'exct.net/open.aspx',      url:'http://exacttarget.com'},
        {name:'Litmus',         pattern:'emltrk.com',              url:'http://litmus.com'},
        {name:'dotmailer',      pattern:'trackedlink.net',         url:'http://dotmailer.com'},
        {name:'Unknown',        pattern:'google.com/appserve/mkt/img/', url:''},
        {name:'Unknown',        pattern:'mailer.dzone.com/open.php', url:''},
        {name:'Unknown',        pattern:'give.islamicreliefcanada.org/smtp.mailopen', url:''},
        {name:'Unknown',        pattern:'email.airmiles.ca/O',     url:''}
    ];

	/*
	 * 
	 */
    var is_blacklisted = function (img) {
        var blacklisted = false;

        for (var index = 0; index < blacklist.length; index++) {
            var element = blacklist[index];
            if (img.src.indexOf(element.pattern) > 0) {
                blacklisted = true;
            }
        }

        // block all images left over that are 1 x 1 (or less, regardless)
        if (!blacklisted) {
            // fetch all possible height values
            var w1 = clean_height_width(img.style.width);
            var w2 = clean_height_width(img.style.maxWidth);
            var w3 = clean_height_width(img.style.minWidth);

            var w4 = -1;
            // check if width attr exists (otherwise dom always returns 0)
            if (typeof img.width != 'undefined') {
                w4 = clean_height_width(img.width);
            }

            // fetch all possible width values
            var h1 = clean_height_width(img.style.height);
            var h2 = clean_height_width(img.style.maxHeight);
            var h3 = clean_height_width(img.style.minHeight);

            var h4 = -1;
            // check if height attr exists (otherwise dom always returns 0)
            if (typeof img.height != 'undefined') {
                h4 = clean_height_width(img.height);
            }

            if ((w1 == 0 || w1 == 1 || w2 == 0 || w2 == 1 || w3 == 0 || w3 == 1 || w4 == 0 || w4 == 1) &&
                (h1 == 0 || h1 == 1 || h2 == 0 || h2 == 1 || h3 == 0 || h3 == 1 || h4 == 0 || h4 == 1)
                ) {
                blacklisted = true;
            }
        }

        // if blacklisted, hide image (ie. prevent the tracking img from loading)
        if (blacklisted) {
            img.style.display = 'none';
            if (img.className.indexOf('blockbear-img-tracking') == -1) {
                img.className = img.className.replace('blockbear-img-safe', '') + ' blockbear-img-tracking';
                window.top.postMessage({ message: 'pixel-tracking', source: 'blockbear-pixel-tracking' }, '*');
            }
        }
        return blacklisted;
    }

    var clean_height_width = function (x) {
        if (x !== "") return parseInt(x, 10);
        return -1;
    }

    var whitelist_image = function (img) {
        if (img.src.substring(0, 4) != 'data') {
            if (img.src.indexOf(imgSafe) == -1) {
                img.src = img.src.replace('#', imgSafe);
            }
        }
        if (img.className.indexOf('blockbear-img-safe') == -1) {
            img.className = img.className.replace('blockbear-img-tracking', '') + ' blockbear-img-safe';
        }
    }

    var scan_images = function () {
        var mailBody = document.getElementsByClassName('nH hx');
        if (mailBody.length > 0) {
            var images = mailBody[0].getElementsByTagName('img');
            for (var index = 0; index < images.length; index++) {
                var element = images[index];
                if (element.src.indexOf(proxyPattern) > 0) {
                    if (!is_blacklisted(element)) {
                        whitelist_image(element);
                    }
                }
            }
        }
        setTimeout(scan_images, 150);
    }
    setTimeout(scan_images, 500);
})();