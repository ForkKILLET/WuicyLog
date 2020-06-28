const zoneName = ["VER", "MODIFY"];
// Disable: [ "VER", "THANKS", "MODIFY", "RELEASE", "DOCUMENTS" ]
const whites = " \t\n", lcLetters = "abcdefghijklmnopqrstuvwxyz", ucLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", letters = lcLetters + ucLetters;
const modifyTypes = ["add", "rmv", "cfg", "rfct", "upg", "dng", "styl"];
const rule = {
    version: {
        matcher: (s) => Array.from(s.match(/VER ([a-zA-Z \u0370-\u03ff]+ )?#([a-z]+) (\d+)\.(\d+)\.(\d+) ([a-zA-z ]+)(?:: ([a-zA-z ]+))?\n{2}/)),
        map: ["era", "state", "main", "sub", "faint", "view", "note"],
        sample: `
VER aβ c #def 11.45.14 gh ijk lm: nop

`
    },
    modify: {
        matcher: (s) => {
            var _a;
            if ((s = s.substring((_a = s.match(/MODIFY\n{2}/)) === null || _a === void 0 ? void 0 : _a.index)) != null) {
                let modifies = s.match(/((add|rmv|cfg|rfct|upg|dng|styl)([?!]{0,2}): +([\S\n ]+?))(?: {2}\n|\n{2})/g);
                if (modifies == null)
                    return;
                modifies = Array.from(modifies);
                let res = [], r, tag;
                for (let m of modifies) {
                    r = Array.from(m.match(/(add|rmv|cfg|rfct|upg|dng|styl)([?!]{0,2}): +([\S\n ]+?)/));
                    tag = r[2];
                    res.push(r
                        .slice(0, 1).concat([tag.includes("!"), tag.includes("?")])
                        .concat(r[3].replace(/ {2}\n|\n{2}$/, "")));
                }
                return res;
            }
        },
        map: [[null, "type", "great", "dev", "brief"]],
        sample: `
MODIFY

add!:       ohhhhhh  
rmv?:       'sudo rm -rf /'  
cfg:        a lot of config  
            config config config config config...  
rfct?!:     I LOVE instability!

`
    }
};
class WuicyLog {
    constructor() {
        this.idx = 0;
    }
    get now() { return this.log[this.idx]; }
    get nxt() { return this.log[this.idx + 1]; }
    white(num) {
        let n = 0;
        while (whites.includes(this.now))
            n++;
        this.idx += n;
        if (num == null)
            return n;
    }
    string(table = letters, whiteAround = true) {
        if (whiteAround)
            this.white();
        let s = "";
        while (table.includes(this.now)) {
            s += this.now;
            this.idx++;
        }
        return s;
    }
    zone(name) {
        if (zoneName.indexOf(name) == -1)
            throw `Unknown zone name: "${name}"`;
        let n = this.string(ucLetters);
        if (n != name)
            throw `Zone name mismatch: "${name}" -- "${n}"`;
    }
    analyse() {
        for (let z of zoneName) {
            this.zone(z);
        }
    }
    from(log, style) {
        this.log = log;
        try {
            this.analyse();
        }
        catch (e) {
            this.struct = e;
        }
        return this;
    }
    to(style) {
        return typeof this.struct === "string" ? this.struct : JSON.stringify(this.struct);
    }
}
let logger = new WuicyLog();
export default logger;
// Debug:
let res = logger.from(`
VER Typed δ #dev 1.0.2 Wuicy update: list

MODIFY

add!:   \`wGlobal\` supported. Don't need config theme for each wuicy any longer.  
upg!:   \`WuicyIcon\`, \`WuicyBadge\` & \`WuicyPara\` are PACKABLE now. Getter \`pack\` returns a simple HTML of the wuicy.  
        e.g. \`new WuicyIcon({ "name": "flag", "color": wColor("#114514") }).pack\` returns  
        \`"<i class="w-icon w-icon-juice fas fa-flag" style="color: rgb(17, 69, 20);"></i>"\`.  
add!:   2 pack wuicies \`WuicyList\` & \`WuicyTextList\`.  
add!:   \`WuicyNav\`, as a special list.  
add!:   \`ripple\` line style for \`WuicyLink\`.  
add:    \`WuicyLink\` now creates a \`a\` element out of its target when the glass is null.  
add?:   \`WuicyTogbar\`, developing, not tested.
        
upg:    \`wColorT\` has a \`fix\` field now. This prevents the color from changing when hovering or in other situations.  
upg:    \`pick\` wuicy instances by ID. And \`$pick\` their glasses.  
upg:    Wuicies now has glass type and lateMake assertions.  
add:    \`wLoc\`, its only use is replace the initial \`@\` of a URL to \`/\` and \`http://localhost:1627/IceLavaTop/dist/\`
        when the page is running on localhost.  
upg:    Slightly smaller title size to 34px.  
upg:    Have more and less garish colors.
        
style:  New comment format for code zone:  
        e.g. \`// :: Zone name\`, \`// :::::: Sub zone name\`  
style:  Remove all semicolons and unnecessary \`??\` operators.
`, "commit").to("json");
console.log(res);
