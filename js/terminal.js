var util = util || {};
util.toArray = function (list) {
    return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function (cmdLineContainer, outputContainer) {
    window.URL = window.URL || window.webkitURL;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    var cmdLine_ = document.querySelector(cmdLineContainer);
    var output_ = document.querySelector(outputContainer);

    const CMDS_ = [
        'abdullah', 'clock', 'date', 'echo', 'whoami', 'help', 'clear'
    ];

    var fs_ = null;
    var cwd_ = null;
    var history_ = [];
    var histpos_ = 0;
    var histtemp_ = 0;

    window.addEventListener('click', function (e) {
        cmdLine_.focus();
    }, false);

    cmdLine_.addEventListener('click', inputTextClick_, false);
    cmdLine_.addEventListener('keydown', historyHandler_, false);
    cmdLine_.addEventListener('keydown', processNewCommand_, false);

    function inputTextClick_(e) {
        this.value = this.value;
    }

    function historyHandler_(e) {
        if (history_.length) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                if (history_[histpos_]) {
                    history_[histpos_] = this.value;
                } else {
                    histtemp_ = this.value;
                }
            }

            if (e.key === 'ArrowUp') {
                histpos_--;
                if (histpos_ < 0) {
                    histpos_ = 0;
                }
            } else if (e.key === 'ArrowDown') {
                histpos_++;
                if (histpos_ > history_.length) {
                    histpos_ = history_.length;
                }
            }

            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
                this.value = this.value;
            }
        }
    }

    //
    function processNewCommand_(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            // Implement tab suggest.
            console.log(histpos_)
            console.log(history_)
        } else if (e.key === 'Enter') {
            // Save shell history.
            if (this.value) {
                history_[history_.length] = this.value;
                histpos_ = history_.length;
            }

            // Duplicate current input and append to output section.
            var line = this.parentNode.parentNode.cloneNode(true);
            line.removeAttribute('id')
            line.classList.add('line');
            var input = line.querySelector('input.cmdline');
            input.autofocus = false;
            input.readOnly = true;
            output_.appendChild(line);

            if (this.value && this.value.trim()) {
                var args = this.value.split(' ').filter(function (val, i) {
                    return val;
                });
                var cmd = args[0].toLowerCase();
                args = args.splice(1); // Remove cmd from arg list.
            }

            switch (cmd) {
                case 'clear':
                    output_.innerHTML = '';
                    this.value = '';
                    return;
                case 'abdullah':
                    output(`
<pre>
{
    "abdullah": {
        "origin": "İzmir, Turkey",
        "education": "Mehmet Akif Ersoy University",
        "major": "Computer Programming",
        "expectedGraduation": "May 2018",
        "interests": ["design", "code", "coffee", "music", "bicycles", "brunch"],
        "thoughts": [
            "<a target='_blank' href='https://twitter.com/apo_bozdag'>@apo_bozdag</a>", 
            "<a target='_blank' href='https://github.com/apo-bozdag'>https://github.com/apo-bozdag</a>", 
            "<a target='_blank' href='https://open.spotify.com/user/11143211175?si=t8PfhwnNRdyqZ7HGSHY7dw'>spotify</a>",
            "<a target='_blank' href='https://steamcommunity.com/id/apo_bozdag/'>steam</a>"
        ],
        "email": "<a target="_blank" href="mailto:abdullah@sanalyer.com">abdullah@sanalyer.com</a>"
    }
}
</pre>
                    `);
                    break;
                case 'clock':
                    var appendDiv = jQuery($('.clock-container')[0].outerHTML);
                    appendDiv.attr('style', 'display:inline-block');
                    output_.appendChild(appendDiv[0]);
                    break;
                case 'date':
                    output(new Date());
                    break;
                case 'echo':
                    output(args.join(' '));
                    break;
                case 'help':
                    output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
                    break;
                case 'whoami':
                    var result = '';
                    $.get("https://api.ipdata.co?api-key=test", function (response) {
                        result += `<img src="${response.flag}" width="16"> `
                        result += `${response.country_name} (${response.country_code}) - ${response.city}`
                        result += `<br>---`
                        result += `<br><b>ip:</b> ${response.ip}`
                        result += `<br>---`
                        result += `<br><b>user agent:</b> ${navigator.appVersion}`
                        result += `<br>---`
                        result += `<br><b>asn;</b><br>`
                        result += `<ul>`
                        result += `<li>asn: ${response.asn.asn}</li>`
                        result += `<li>name: ${response.asn.name}</li>`
                        result += `<li>domain: ${response.asn.domain}</li>`
                        result += `<li>route: ${response.asn.route}</li>`
                        result += `<li>type: ${response.asn.type}</li>`
                        result += `</ul>`
                        result += `<br><b>languages;</b><br>`
                        result += `<ul>`
                        response.languages.forEach(function (item) {
                            result += `<li>${item.name} - ${item.native}</li>`
                        })
                        result += `</ul>`
                        result += `<br><b>time zone;</b><br>`
                        result += `<ul>`
                        result += `<li>name: ${response.time_zone.name}</li>`
                        result += `<li>abbr: ${response.time_zone.abbr}</li>`
                        result += `<li>offset: ${response.time_zone.offset}</li>`
                        result += `<li>is dst: ${response.time_zone.is_dst}</li>`
                        result += `</ul>`
                        output(result);
                    }, "jsonp");
                    output(result);
                    break;
                default:
                    if (cmd) {
                        output(cmd + ': command not found');
                    }
            }

            window.scrollTo(0, getDocHeight_());
            this.value = ''; // Clear/setup line for next input.
        }
    }

    //
    function formatColumns_(entries) {
        var maxName = entries[0].name;
        util.toArray(entries).forEach(function (entry, i) {
            if (entry.name.length > maxName.length) {
                maxName = entry.name;
            }
        });

        var height = entries.length <= 3 ?
            'height: ' + (entries.length * 15) + 'px;' : '';

        // 12px monospace font yields ~7px screen width.
        var colWidth = maxName.length * 7;

        return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
    }

    //
    function output(html) {
        output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
    }

    // Cross-browser impl to get document's height.
    function getDocHeight_() {
        var d = document;
        return Math.max(
            Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
            Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
            Math.max(d.body.clientHeight, d.documentElement.clientHeight)
        );
    }

    //
    return {
        init: function () {
            output(`
            <img align="left" src="img/icon.png" width="100" height="100" style="padding: 0px 10px 20px 0px">
            <h2 style="letter-spacing: 4px">Abdullah Bozdag</h2><p>${new Date()}</p>
            <p>Enter "help" for more information.</p>
            `);
        },
        output: output
    }
};