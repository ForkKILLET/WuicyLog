(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            if ((s = s.substring(s.match(/MODIFY\n{2}/)?.index)) != null) {
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
            debugger;
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
exports.default = logger;
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxNQUFNLFFBQVEsR0FBRyxDQUFFLEtBQUssRUFBRSxRQUFRLENBQUUsQ0FBQTtBQUNwQyxpRUFBaUU7QUFDakUsTUFDSSxNQUFNLEdBQVEsT0FBTyxFQUNyQixTQUFTLEdBQUssNEJBQTRCLEVBQzFDLFNBQVMsR0FBSyw0QkFBNEIsRUFDMUMsT0FBTyxHQUFPLFNBQVMsR0FBRyxTQUFTLENBQUE7QUFFdkMsTUFBTSxXQUFXLEdBQUcsQ0FBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUUsQ0FBQTtBQWlDekUsTUFBTSxJQUFJLEdBQUc7SUFDVCxPQUFPLEVBQUU7UUFDTCxPQUFPLEVBQUUsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FDdEMsbUdBQW1HLENBQ3RHLENBQUM7UUFDRixHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDN0QsTUFBTSxFQUFFOzs7Q0FHZjtLQUFJO0lBQ0QsTUFBTSxFQUFFO1FBQ0osT0FBTyxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUU7WUFDbkIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUU7Z0JBQzFELElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsNkVBQTZFLENBQUMsQ0FBQTtnQkFDckcsSUFBSSxRQUFRLElBQUksSUFBSTtvQkFBRSxPQUFNO2dCQUM1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QUcsR0FBRyxHQUFHLENBQUE7UUFDZCxJQUFJO1lBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFBO1NBQUU7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO1NBQUU7UUFDcEQsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBRUQsRUFBRSxDQUFDLEtBQWE7UUFDWixPQUFPLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3RGLENBQUM7Q0FDSjtBQUVELElBQUksTUFBTSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUE7QUFDM0Isa0JBQWUsTUFBTSxDQUFBO0FBRXJCLFNBQVM7QUFDVCxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTBCckIsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUE7QUFFdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHpvbmVOYW1lID0gWyBcIlZFUlwiLCBcIk1PRElGWVwiIF1cbi8vIERpc2FibGU6IFsgXCJWRVJcIiwgXCJUSEFOS1NcIiwgXCJNT0RJRllcIiwgXCJSRUxFQVNFXCIsIFwiRE9DVU1FTlRTXCIgXVxuY29uc3RcbiAgICB3aGl0ZXMgICAgICA9IFwiIFxcdFxcblwiLFxuICAgIGxjTGV0dGVycyAgID0gXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elwiLFxuICAgIHVjTGV0dGVycyAgID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiLFxuICAgIGxldHRlcnMgICAgID0gbGNMZXR0ZXJzICsgdWNMZXR0ZXJzXG5cbmNvbnN0IG1vZGlmeVR5cGVzID0gWyBcImFkZFwiLCBcInJtdlwiLCBcImNmZ1wiLCBcInJmY3RcIiwgXCJ1cGdcIiwgXCJkbmdcIiwgXCJzdHlsXCIgXVxuaW50ZXJmYWNlIFd1aWN5TG9nU3RydWN0IHtcbiAgICB2ZXJzaW9uOiB7XG4gICAgICAgIGVyYTogICAgc3RyaW5nXG5cbiAgICAgICAgc3RhdGU6ICBzdHJpbmdcbiAgICAgICAgbWFpbjogICBudW1iZXJcbiAgICAgICAgc3ViOiAgICBudW1iZXJcbiAgICAgICAgZmFpbnQ6ICBudW1iZXJcblxuICAgICAgICB2aWV3OiAgIHN0cmluZ1xuICAgICAgICBub3RlOiAgIHN0cmluZ1xuICAgIH0sXG4gICAgdGhhbmtzPzoge1xuICAgICAgICBuYW1lOiAgIHN0cmluZ1xuICAgICAgICBncmVhdDogIGJvb2xlYW5cbiAgICAgICAgcmVhc29uOiBzdHJpbmdcbiAgICB9IFtdLFxuICAgIG1vZGlmeToge1xuICAgICAgICB0eXBlOiAgIHN0cmluZ1xuICAgICAgICBncmVhdDogIGJvb2xlYW5cbiAgICAgICAgZGV2OiAgICBib29sZWFuXG5cbiAgICAgICAgYnJpZWY6ICBzdHJpbmdcbiAgICB9IFtdLFxuICAgIHJlbGVhc2U6ICAgIHN0cmluZ1tdXG4gICAgZG9jdW1lbnRzOiAgc3RyaW5nW11cbiAgICB0aW1lOiB7XG4gICAgICAgIHllYXI6ICAgbnVtYmVyXG4gICAgICAgIG1vbnRoOiAgbnVtYmVyXG4gICAgICAgIGRheTogICAgbnVtYmVyXG4gICAgfVxufVxuY29uc3QgcnVsZSA9IHtcbiAgICB2ZXJzaW9uOiB7XG4gICAgICAgIG1hdGNoZXI6IChzOiBzdHJpbmcpID0+IEFycmF5LmZyb20ocy5tYXRjaChcbiAgICAgICAgICAgIC9WRVIgKFthLXpBLVogXFx1MDM3MC1cXHUwM2ZmXSsgKT8jKFthLXpdKykgKFxcZCspXFwuKFxcZCspXFwuKFxcZCspIChbYS16QS16IF0rKSg/OjogKFthLXpBLXogXSspKT9cXG57Mn0vXG4gICAgICAgICkpLFxuICAgICAgICBtYXA6IFtcImVyYVwiLCBcInN0YXRlXCIsIFwibWFpblwiLCBcInN1YlwiLCBcImZhaW50XCIsIFwidmlld1wiLCBcIm5vdGVcIl0sXG4gICAgICAgIHNhbXBsZTogYFxuVkVSIGHOsiBjICNkZWYgMTEuNDUuMTQgZ2ggaWprIGxtOiBub3BcblxuYCAgIH0sXG4gICAgbW9kaWZ5OiB7XG4gICAgICAgIG1hdGNoZXI6IChzOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGlmICgocyA9IHMuc3Vic3RyaW5nKHMubWF0Y2goL01PRElGWVxcbnsyfS8pPy5pbmRleCkpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kaWZpZXMgPSBzLm1hdGNoKC8oKGFkZHxybXZ8Y2ZnfHJmY3R8dXBnfGRuZ3xzdHlsKShbPyFdezAsMn0pOiArKFtcXFNcXG4gXSs/KSkoPzogezJ9XFxufFxcbnsyfSkvZylcbiAgICAgICAgICAgICAgICBpZiAobW9kaWZpZXMgPT0gbnVsbCkgcmV0dXJuXG4gICAgICAgICAgICAgICAgbW9kaWZpZXMgPSBBcnJheS5mcm9tKG1vZGlmaWVzKVxuICAgICAgICAgICAgICAgIGxldCByZXM6IChzdHJpbmcgfCBib29sZWFuKVtdW10gPSBbXSwgcjogKHN0cmluZyB8IGJvb2xlYW4pW10sIHRhZzogc3RyaW5nXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbSBvZiBtb2RpZmllcykge1xuICAgICAgICAgICAgICAgICAgICByID0gQXJyYXkuZnJvbShtLm1hdGNoKC8oYWRkfHJtdnxjZmd8cmZjdHx1cGd8ZG5nfHN0eWwpKFs/IV17MCwyfSk6ICsoW1xcU1xcbiBdKz8pLykpXG4gICAgICAgICAgICAgICAgICAgIHRhZyA9IHJbMl0gYXMgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZSgwLCAxKS5jb25jYXQoWyB0YWcuaW5jbHVkZXMoXCIhXCIpLCB0YWcuaW5jbHVkZXMoXCI/XCIpIF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY29uY2F0KChyWzNdIGFzIHN0cmluZykucmVwbGFjZSgvIHsyfVxcbnxcXG57Mn0kLywgXCJcIikpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtYXA6IFsgWyBudWxsLCBcInR5cGVcIiwgXCJncmVhdFwiLCBcImRldlwiLCBcImJyaWVmXCIgXSBdLFxuICAgICAgICBzYW1wbGU6IGBcbk1PRElGWVxuXG5hZGQhOiAgICAgICBvaGhoaGhoICBcbnJtdj86ICAgICAgICdzdWRvIHJtIC1yZiAvJyAgXG5jZmc6ICAgICAgICBhIGxvdCBvZiBjb25maWcgIFxuICAgICAgICAgICAgY29uZmlnIGNvbmZpZyBjb25maWcgY29uZmlnIGNvbmZpZy4uLiAgXG5yZmN0PyE6ICAgICBJIExPVkUgaW5zdGFiaWxpdHkhXG5cbmAgICB9XG59XG5cbmNsYXNzIFd1aWN5TG9nIHtcbiAgICBsb2c6IHN0cmluZ1xuICAgIHN0cnVjdDogV3VpY3lMb2dTdHJ1Y3QgfCBzdHJpbmdcbiAgICBpZHg6IG51bWJlciA9IDBcbiAgICBnZXQgbm93KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmxvZ1t0aGlzLmlkeF0gfVxuICAgIGdldCBueHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubG9nW3RoaXMuaWR4ICsgMV0gfVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB3aGl0ZShudW06IG51bWJlciB8IHZvaWQpOiBudW1iZXIgfCB2b2lkIHtcbiAgICAgICAgbGV0IG4gPSAwXG4gICAgICAgIHdoaWxlICh3aGl0ZXMuaW5jbHVkZXModGhpcy5ub3cpKSBuKytcbiAgICAgICAgdGhpcy5pZHggKz0gblxuICAgICAgICBpZiAobnVtID09IG51bGwpIHJldHVybiBuXG4gICAgfVxuICAgIHByaXZhdGUgc3RyaW5nKHRhYmxlOiBzdHJpbmcgPSBsZXR0ZXJzLCB3aGl0ZUFyb3VuZDogYm9vbGVhbiA9IHRydWUpOiBzdHJpbmcge1xuICAgICAgICBpZiAod2hpdGVBcm91bmQpIHRoaXMud2hpdGUoKVxuICAgICAgICBsZXQgcyA9IFwiXCJcbiAgICAgICAgd2hpbGUgKHRhYmxlLmluY2x1ZGVzKHRoaXMubm93KSkge1xuICAgICAgICAgICAgcyArPSB0aGlzLm5vdzsgdGhpcy5pZHgrK1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzXG4gICAgfVxuICAgIHByaXZhdGUgem9uZShuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHpvbmVOYW1lLmluZGV4T2YobmFtZSkgPT0gLTEpIHRocm93IGBVbmtub3duIHpvbmUgbmFtZTogXCIke25hbWV9XCJgXG4gICAgICAgIGxldCBuID0gdGhpcy5zdHJpbmcodWNMZXR0ZXJzKVxuICAgICAgICBpZiAobiAhPSBuYW1lKSB0aHJvdyBgWm9uZSBuYW1lIG1pc21hdGNoOiBcIiR7bmFtZX1cIiAtLSBcIiR7bn1cImBcblxuICAgIH1cblxuICAgIGFuYWx5c2UoKSB7XG4gICAgICAgIGZvciAobGV0IHogb2Ygem9uZU5hbWUpIHtcbiAgICAgICAgICAgIGRlYnVnZ2VyXG4gICAgICAgICAgICB0aGlzLnpvbmUoeilcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnJvbShsb2c6IHN0cmluZywgc3R5bGU6IFwiY29tbWl0XCIpOiBXdWljeUxvZyB7XG4gICAgICAgIHRoaXMubG9nID0gbG9nXG4gICAgICAgIHRyeSB7IHRoaXMuYW5hbHlzZSgpIH0gY2F0Y2ggKGUpIHsgdGhpcy5zdHJ1Y3QgPSBlIH1cbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICB0byhzdHlsZTogXCJqc29uXCIpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB0aGlzLnN0cnVjdCA9PT0gXCJzdHJpbmdcIiA/IHRoaXMuc3RydWN0IDogSlNPTi5zdHJpbmdpZnkodGhpcy5zdHJ1Y3QpXG4gICAgfVxufVxuXG5sZXQgbG9nZ2VyID0gbmV3IFd1aWN5TG9nKClcbmV4cG9ydCBkZWZhdWx0IGxvZ2dlclxuXG4vLyBEZWJ1ZzpcbmxldCByZXMgPSBsb2dnZXIuZnJvbShgXG5WRVIgVHlwZWQgzrQgI2RldiAxLjAuMiBXdWljeSB1cGRhdGU6IGxpc3RcblxuTU9ESUZZXG5cbmFkZCE6ICAgXFxgd0dsb2JhbFxcYCBzdXBwb3J0ZWQuIERvbid0IG5lZWQgY29uZmlnIHRoZW1lIGZvciBlYWNoIHd1aWN5IGFueSBsb25nZXIuICBcbnVwZyE6ICAgXFxgV3VpY3lJY29uXFxgLCBcXGBXdWljeUJhZGdlXFxgICYgXFxgV3VpY3lQYXJhXFxgIGFyZSBQQUNLQUJMRSBub3cuIEdldHRlciBcXGBwYWNrXFxgIHJldHVybnMgYSBzaW1wbGUgSFRNTCBvZiB0aGUgd3VpY3kuICBcbiAgICAgICAgZS5nLiBcXGBuZXcgV3VpY3lJY29uKHsgXCJuYW1lXCI6IFwiZmxhZ1wiLCBcImNvbG9yXCI6IHdDb2xvcihcIiMxMTQ1MTRcIikgfSkucGFja1xcYCByZXR1cm5zICBcbiAgICAgICAgXFxgXCI8aSBjbGFzcz1cInctaWNvbiB3LWljb24tanVpY2UgZmFzIGZhLWZsYWdcIiBzdHlsZT1cImNvbG9yOiByZ2IoMTcsIDY5LCAyMCk7XCI+PC9pPlwiXFxgLiAgXG5hZGQhOiAgIDIgcGFjayB3dWljaWVzIFxcYFd1aWN5TGlzdFxcYCAmIFxcYFd1aWN5VGV4dExpc3RcXGAuICBcbmFkZCE6ICAgXFxgV3VpY3lOYXZcXGAsIGFzIGEgc3BlY2lhbCBsaXN0LiAgXG5hZGQhOiAgIFxcYHJpcHBsZVxcYCBsaW5lIHN0eWxlIGZvciBcXGBXdWljeUxpbmtcXGAuICBcbmFkZDogICAgXFxgV3VpY3lMaW5rXFxgIG5vdyBjcmVhdGVzIGEgXFxgYVxcYCBlbGVtZW50IG91dCBvZiBpdHMgdGFyZ2V0IHdoZW4gdGhlIGdsYXNzIGlzIG51bGwuICBcbmFkZD86ICAgXFxgV3VpY3lUb2diYXJcXGAsIGRldmVsb3BpbmcsIG5vdCB0ZXN0ZWQuXG4gICAgICAgIFxudXBnOiAgICBcXGB3Q29sb3JUXFxgIGhhcyBhIFxcYGZpeFxcYCBmaWVsZCBub3cuIFRoaXMgcHJldmVudHMgdGhlIGNvbG9yIGZyb20gY2hhbmdpbmcgd2hlbiBob3ZlcmluZyBvciBpbiBvdGhlciBzaXR1YXRpb25zLiAgXG51cGc6ICAgIFxcYHBpY2tcXGAgd3VpY3kgaW5zdGFuY2VzIGJ5IElELiBBbmQgXFxgJHBpY2tcXGAgdGhlaXIgZ2xhc3Nlcy4gIFxudXBnOiAgICBXdWljaWVzIG5vdyBoYXMgZ2xhc3MgdHlwZSBhbmQgbGF0ZU1ha2UgYXNzZXJ0aW9ucy4gIFxuYWRkOiAgICBcXGB3TG9jXFxgLCBpdHMgb25seSB1c2UgaXMgcmVwbGFjZSB0aGUgaW5pdGlhbCBcXGBAXFxgIG9mIGEgVVJMIHRvIFxcYC9cXGAgYW5kIFxcYGh0dHA6Ly9sb2NhbGhvc3Q6MTYyNy9JY2VMYXZhVG9wL2Rpc3QvXFxgXG4gICAgICAgIHdoZW4gdGhlIHBhZ2UgaXMgcnVubmluZyBvbiBsb2NhbGhvc3QuICBcbnVwZzogICAgU2xpZ2h0bHkgc21hbGxlciB0aXRsZSBzaXplIHRvIDM0cHguICBcbnVwZzogICAgSGF2ZSBtb3JlIGFuZCBsZXNzIGdhcmlzaCBjb2xvcnMuXG4gICAgICAgIFxuc3R5bGU6ICBOZXcgY29tbWVudCBmb3JtYXQgZm9yIGNvZGUgem9uZTogIFxuICAgICAgICBlLmcuIFxcYC8vIDo6IFpvbmUgbmFtZVxcYCwgXFxgLy8gOjo6Ojo6IFN1YiB6b25lIG5hbWVcXGAgIFxuc3R5bGU6ICBSZW1vdmUgYWxsIHNlbWljb2xvbnMgYW5kIHVubmVjZXNzYXJ5IFxcYD8/XFxgIG9wZXJhdG9ycy5cbmAsIFwiY29tbWl0XCIpLnRvKFwianNvblwiKVxuXG5jb25zb2xlLmxvZyhyZXMpXG4iXX0=
