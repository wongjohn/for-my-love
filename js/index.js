'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {

    var AUTHOR = {
        AUTHOR: 'author',
        ME: 'me'
    };

    var TYPING_MSG_CONTENT = '\n        <div class="dot"></div>\n        <div class="dot"></div>\n        <div class="dot"></div>\n    ';

    var msgSendingHandler = null;

    var vm = new Vue({
        el: '#mobile',

        data: {
            messages: [],
            dialogs: null,
            lastDialog: null,
            msgChain: Promise.resolve(),

            isTyping: false,

            // topics that user can ask
            nextTopics: [],

            hasPrompt: false,

            latestMsgContent: null
        },

        mounted: function mounted() {
            var _this = this;
                const data = {
    "fromMe": [{
        "id": "0000",
        "details": [
            [
                "你好，我是晚恒🫶",
                "💐💐💐情人节快乐💐💐💐",
                "我的宝贝😘",
                "🌹🌹🌹送你花花🌹🌹🌹",
                "<pre>🍀🍀🍀🌹🍀🍀🍀🌹🍀🍀🍀 \n🍀🍀🌹🌹🌹🍀🌹🌹🌹🍀🍀 \n🍀🌹🌹🌹🌹🌹🌹🌹🌹🌹🍀 \n🍀🌹🌹🌹🌹🌹🌹🌹🌹🌹🍀 \n🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹 \n🍀🌹🌹🌹🌹🌹🌹🌹🌹🌹🍀 \n🍀🍀🌹🌹🌹🌹🌹🌹🌹🍀🍀 \n🍀🍀🍀🌹🌹🌹🌹🌹🍀🍀🍀 \n🍀🍀🍀🍀🍀🌹🍀🍀🍀🍀🍀</pre>",
                "几日不见📅",
                "十分想念😘",
                "<img src='img/separate.jpeg'>",
                "谢谢宝贝送我的情人节礼物",
                "<img src='img/gift.jpg'>",
                "真的好帅",
                "你说你讨厌异地恋🤔",
                "但是你还是选择和我在一起了😘",
                "你是我最好的宝贝",
                "<img src='img/kiss.gif'>",
                "稍等一下🙂",
                "让我再看一眼你的照片😘",
                "<img src='img/in-taiyuan.jpg'>",
                "太好看了",
                "-----------",
                "跟你在一起的每一天📅",
                "都让我感到十分快乐📬",
                "想和你一起做饭🍲",
                "想和你一起学习📖",
                "想和你一起锻炼🛹",
                "想和你你一起去旅游🚂",
                "<img src='img/travel.webp'>",
                "我会将玫瑰藏于身后",
                "时刻期待着与你赴约！！！",
                "\"W\" & \"H\", \"Warm\" 和 \"Happy\"",
                "这两个单词恰恰就是爱情该有的样子",
                "今天是情人节, 祝愿咱俩的爱情永恒, 快乐永远. ",
                "我爱你, 文慧❤️❤️"
            ]
        ],
        "responses": [{
            "content": "我喜欢你",
            "nextAuthor": ["0001"]
        }]
    }, {
        "id": "0001",
        "details": [
            [
                "<img src='img/kiss-my-princess.png'>",
                "宝贝我好开心呀😁",
                "我也超级喜欢你",
                "遇见你真的是我的幸运😘",
            ]
        ]
    }],
    "fromUser": []
}

                _this.dialogs = data;

                _this.nextTopics = _this.dialogs.fromUser;

                _this.appendDialog('0000');

        },


        methods: {
            appendDialog: function appendDialog(id) {
                var _this2 = this;

                if ((typeof id === 'undefined' ? 'undefined' : _typeof(id)) === 'object' && id.length > 0) {
                    // array of dialog ids
                    id.forEach(function (id) {
                        return _this2.appendDialog(id);
                    });
                    return;
                } else if (id == null) {
                    // clear possible responses
                    this.lastDialog.responses = null;
                    return;
                }

                this.isTyping = true;

                var dialog = this.getDialog(id);

                getRandomMsg(dialog.details).forEach(function (content) {
                    _this2.msgChain = _this2.msgChain.then(function () {
                        return delay(600);
                    }).then(function () {
                        return _this2.sendMsg(content, AUTHOR.AUTHOR);
                    });
                });

                return dialog.nextAuthor ? this.appendDialog(dialog.nextAuthor) : this.msgChain.then(function () {
                    _this2.lastDialog = dialog;
                    _this2.isTyping = false;
                });
            },
            sendMsg: function sendMsg(message, author) {
                switch (author) {
                    case 'me':
                        return this.sendUserMsg(message);
                    default:
                        return this.sendFriendMsg(message, author);
                }
            },
            sendFriendMsg: function sendFriendMsg(message, author) {
                var _this3 = this;

                var content = getRandomMsg(message);
                var length = content.replace(/<[^>]+>/g, "").length;
                var isImg = /<img[^>]+>/.test(content);
                var isTyping = length > 2 || isImg;

                var msg = {
                    author: author,
                    content: isTyping ? TYPING_MSG_CONTENT : content,
                    isImg: isImg
                };
                this.messages.push(msg);

                if (isTyping) {
                    this.markMsgSize(msg);
                    setTimeout(updateScroll);

                    return delay(Math.min(100 * length, 2000)).then(function () {
                        return _this3.markMsgSize(msg, content);
                    }).then(function () {
                        return delay(150);
                    }).then(function () {
                        msg.content = content;
                        onMessageSending();
                    });
                }

                onMessageSending();

                return Promise.resolve();
            },
            sendUserMsg: function sendUserMsg(message) {
                this.messages.push({
                    author: AUTHOR.ME,
                    content: message
                });

                onMessageSending();

                return Promise.resolve();
            },
            markMsgSize: function markMsgSize(msg) {
                var _this4 = this;

                var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                this.latestMsgContent = content || msg.content;

                return delay(0).then(function () {
                    return msg.isImg && onImageLoad($('#mock-msg img'));
                }).then(function () {
                    Object.assign(msg, getMockMsgSize());
                    _this4.messages = [].concat(_toConsumableArray(_this4.messages));
                });
            },
            getDialog: function getDialog(id) {
                // only one dialog should be matched by id
                var dialogs = this.dialogs.fromMe.filter(function (dialog) {
                    return dialog.id === id;
                });
                return dialogs ? dialogs[0] : null;
            },
            getDialogFromUser: function getDialogFromUser(id) {
                // only one dialog should be matched by id
                var dialogs = this.dialogs.fromUser.filter(function (dialog) {
                    return dialog.id === id;
                });
                return dialogs ? dialogs[0] : null;
            },
            togglePrompt: function togglePrompt(toShow) {
                if (this.isTyping) {
                    // don't prompt if author is typing
                    return;
                }

                this.hasPrompt = toShow;
            },
            respond: function respond(response) {
                return this.say(response.content, response.nextAuthor);
            },
            ask: function ask(fromUser) {
                var content = getRandomMsg(fromUser.details);
                return this.say(content, fromUser.nextAuthor);
            },
            say: function say(content, dialogId) {
                var _this5 = this;

                // close prompt
                this.hasPrompt = false;

                return delay(200)
                // send user msg
                .then(function () {
                    return _this5.sendMsg(content, AUTHOR.ME);
                }).then(function () {
                    return delay(300);
                })
                // add author's next dialogs
                .then(function () {
                    return _this5.appendDialog(dialogId);
                });
            }
        }
    });

    /**
     * get a random message from message array
     */
    function getRandomMsg(messages) {
        // single item
        if (typeof messages === 'string' || !messages.length) {
            return messages;
        }

        var id = Math.floor(Math.random() * messages.length);
        return messages[id];
    }

    /**
     * UI updating when new message is sending
     */
    function onMessageSending() {
        setTimeout(function () {
            // update scroll position when vue has updated ui
            updateScroll();

            var $latestMsg = $('#mobile-body-content .msg-row:last-child .msg');

            // add target="_blank" for links
            $latestMsg.find('a').attr('target', '_blank');

            // update scroll position when images are loaded
            onImageLoad($latestMsg).then(updateScroll);
        });
    }

    function updateScroll() {
        var $chatbox = $('#mobile-body-content');

        var distance = $chatbox[0].scrollHeight - $chatbox.height() - $chatbox.scrollTop();
        var duration = 250;
        var startTime = Date.now();

        requestAnimationFrame(function step() {
            var p = Math.min(1, (Date.now() - startTime) / duration);
            $chatbox.scrollTop($chatbox.scrollTop() + distance * p);
            p < 1 && requestAnimationFrame(step);
        });
    }

    function delay() {
        var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        return new Promise(function (resolve) {
            setTimeout(resolve, amount);
        });
    }

    function getMockMsgSize() {
        var $mockMsg = $('#mock-msg');
        return {
            width: $mockMsg.width(),
            height: $mockMsg.height()
        };
    }

    function onImageLoad($img) {
        return new Promise(function (resolve) {
            $img.one('load', resolve).each(function (index, target) {
                // trigger load when the image is cached
                target.complete && $(target).trigger('load');
            });
        });
    }
})();