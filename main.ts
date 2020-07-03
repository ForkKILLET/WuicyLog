// :: Locomotive

type nestedArray <T> = (T | nestedArray <T>) []

// :: Main

class WuicyLogStruct {
    version = {}
    thanks = []
    modify = []
    release = []
    documents = []
    time = {}
}

type mapArray   = nestedArray   <string | symbol>
type resArray   = nestedArray   <string | boolean | number>
interface wLogZoneMatchRes {
    res: resArray
    idx: number
}

const val = Symbol("LogMapVal")
const each = Symbol("LogMapEach")
const keys = Symbol("LogMapKeys")

function wLogListMatcher(title: RegExp, key: RegExp, tag: string) {
    return s => {
        let idx: number
        s = s.substring(idx = s.match(title)?.[0].length)
        if (s == null) return
        let tagNum = tag.length
        tag = tag.replace(/(?=[\\^\[\]])/g, "\\")
        let re = RegExp(`(?:${key.source}([${tag}]{0,${tagNum}}): +((?:[\\S ]+?(?: {3}\\n)?)+?))(?: {2}\\n|\\n{2})`)
        let rr: RegExpMatchArray = s.match(RegExp(re, "g"))
        if (rr == null) return
        let res: (string | boolean)[][] = [], i: (string | boolean)[], curTag: string,
            items = Array.from(rr), tagRes: boolean[]
        for (let m of items) {
            idx += m.length
            i = Array.from(m.match(re))
            curTag = i[2] as string
            tagRes = []
            for (let i = 0; i < tag.length; i++) tagRes.push(curTag.includes(tag[i]))
            res.push(i.slice(0, 2).concat(tagRes).concat(i[3]))
        }
        return {
            res: res,
            idx: idx
        }
    }
}
const wLogRule: {
    [index: string]: {
        matcher: (s: string) => wLogZoneMatchRes
        map: mapArray,
        sample: string
    }
} = {
    version: {
        matcher: s => {
            let rr = s.match(
                /^VER ([a-zA-Z \u0370-\u03ff]+ )?#([a-z]+) (\d+)\.(\d+)\.(\d+) ([a-zA-z ]+)(?:: ([a-zA-z ]+))?\n{2}/
            )
            let res: resArray = Array.from(rr)
            for (let i of [ 3, 4, 5 ]) res[i] = parseInt(res[i] as string)
            return {
                res: res,
                idx: rr[0].length
            }
        },
        map: [ null,
            [ "era", val ], [ "state", val ], [ "main", val ], [ "sub", val ], [ "faint", val ],
            [ "view", val ], [ "note", val ]
        ],
        sample: `
VER aβ c #def 11.45.14 gh ijk lm: nop

`   },
    thanks: {
        matcher: wLogListMatcher(/^THANKS\n{2}/, /(?:@(\S+?))/, "!$'"),
        map: [
            [ each, [ null,
                [ "user", val ], [ "great", val ], [ "econ", val ], [ "code", val ], [ "brief", val ]
            ] ]
        ],
        sample: `
THANKS

@wuxianucw!:    UCW is our red sun!  
@smallfang$:    He offered fk a nice domain for free!  
@bohanjun$':    Built an internal high-speed mirror node.   
                Optimized some CSS for fk.

`   },
    modify: {
        matcher: wLogListMatcher(/^MODIFY\n{2}/, /(add|rmv|cfg|rfct|upg|dng|styl|mod)/, "!?"),
        map: [
            [ each, [ null,
                [ "type", val ], [ "great", val ], [ "dev", val ], [ "brief", val ]
            ] ]
        ],
        sample: `
MODIFY

add!:       ohhhhhh  
rmv?:       'sudo rm -rf /'  
cfg:        a lot of config   
            config config config config config...  
rfct?!:     I LOVE instability!

`   }
}

class WuicyLogger {
    log: string
    struct: WuicyLogStruct | string = new WuicyLogStruct()

    constructor() {}

    private doMap(map: mapArray, loc: any, r: resArray, mode: symbol) {
        let v: mapArray
        for (let i in mode === each ? r : map) {
            if (mode === keys) {
                v = map[i] as []
                if (v == null) continue

                if (typeof v[0] === "symbol") {
                    switch (v[0]) {
                        case each:
                            this.doMap(v[1] as mapArray, loc, r, each)
                            break
                    }
                }
            }

            let curLoc: any = loc
            switch (mode) {
                case each:
                    loc.push(curLoc = {})
                    this.doMap(map, loc[i], r[i] as resArray, keys)
                    break
                case keys:
                    curLoc[v[0] as string] = v[1] === val ? r[i] : v[1]
            }
        }
    }
    analyse() {
        let i = 0
        let s = this.log
        for (let n in wLogRule) {
            let z = wLogRule[n],
                r = z.matcher(s = s.substring(i))
            if (r == null) continue
            i = r.idx
            this.doMap(z.map, this.struct[n], r.res, keys)
        }
    }

    from(log: string, style: "commit"): WuicyLogger {
        this.log = log
        try { this.analyse() } catch (e) {
            this.struct = e
        }
        return this
    }

    to(style: "json") {
        return this.struct instanceof Error ? this.struct : JSON.stringify(this.struct, null, 4)
    }

    test() {
        let s = ""
        for (let z in wLogRule) s += wLogRule[z].sample.substring(1)
        console.log(logger.from(s, "commit").to("json"))
    }
}

let logger = new WuicyLogger()
export default logger

// Debug:
logger.test()
