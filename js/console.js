var now1 = new Date();

function createtime1() {
    var grt = new Date("01/09/2023 22:00:00"); //此处修改你的建站时间或者网站上线时间
    now1.setTime(now1.getTime() + 250);
    var days = (now1 - grt) / 1000 / 60 / 60 / 24;
    var dnum = Math.floor(days);

    var ascll = [
        `欢迎来到魔法使的后花园`,
        `Beyond the sky,into the firmament.`,
        `
        ┌┐ ┬  ┌─┐┌┐┌┌┬┐┌─┐┌┬┐┌─┐┬─┐┬┌─┐┌─┐
        ├┴┐│  │ ││││ ││├┤ │││├─┤├┬┘│└─┐├─┤
        └─┘┴─┘└─┘┘└┘─┴┘└─┘┴ ┴┴ ┴┴└─┴└─┘┴ ┴

`,
        "后花园已开放",
        dnum,
        "天啦!",
        "©2023 By 黄金发の魔理沙",
    ];

    setTimeout(
        console.log.bind(
            console,
            `\n%c${ascll[0]} %c ${ascll[1]} %c ${ascll[2]} %c${ascll[3]}%c ${ascll[4]}%c ${ascll[5]}\n\n%c ${ascll[6]}\n`,
            "color:#39c5bb",
            "",
            "color:#39c5bb",
            "color:#39c5bb",
            "",
            "color:#39c5bb",
            ""
        )
    );
}

createtime1();

function createtime2() {
    var ascll2 = [`恋符「Master Spark」`, `莎莎布置的魔法发现访客！欢迎来访！`, ];

    // setTimeout(
    //     console.log.bind(
    //         console,
    //         `%c ${ascll2[0]} %c ${ascll2[1]} %c \n${ascll2[2]} %c\n${ascll2[3]}`,
    //         "color:white; background-color:#10bcc0",
    //         "",
    //         "",
    //         'background:url("https://unpkg.zhimg.com/anzhiyu-assets@latest/image/common/tinggge.gif") no-repeat;font-size:450%'
    //     )
    // );

    setTimeout(console.log.bind(console, "%c 恋符「Master Spark」 %c 欢迎光临，人类", "color:white; background-color:#23c682", ""));

    setTimeout(
        console.warn.bind(
            console,
            "%c ⚡ Powered by 黄金发の魔理沙 %c 你正在访问魔法使的后花园",
            "color:white; background-color:#f0ad4e",
            ""
        )
    );

    setTimeout(console.log.bind(console, "%c 魔符「Milky Way」 %c 莎莎的魔法发现您已打开控制台", "color:white; background-color:#4f90d9", ""));
    setTimeout(
        console.warn.bind(console, "%c 魔符「Stardust Reverie」 %c 您现在正处于魔法监控中", "color:white; background-color:#d9534f", "")
    );
}
createtime2();

// 重写console方法
console.log = function () { };
console.error = function () { };
console.warn = function () { };