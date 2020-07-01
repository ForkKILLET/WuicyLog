// :: Locomotive

type nestedArray <T> = (T | nestedArray <T>) []
type nestedItem <T> = T | nestedArray <T>

// :: Main

class LogStruct {
    version = {}
    thanks = {}
    modify = []
    release = []
    documents = []
    time = {}
}

type mapArray   = nestedArray   <string | symbol>
type mapItem    = nestedItem    <string | symbol>
type resArray   = nestedArray   <string | boolean | number>
type resItem    = nestedItem    <string | boolean | number>

interface ILogZoneMatchRes {
    res: resArray
    idx: number
}

const val = Symbol("LogMapVal")
const each = Symbol("LogMapEach")
const keys = Symbol("LogMapKeys")

const logRule: {
    [index: string]: {
        matcher: (s: string) => ILogZoneMatchRes
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
    modify: {
        matcher: s => {
            s = s.substring(s.match(/^MODIFY\n{2}/)?.index)
            if (s == null) return
            let r = /(?:(add|rmv|cfg|rfct|upg|dng|styl)([?!]{0,2}): +([\S\n ]+?))(?: {2}\n|\n{2})/
            let rr = s.match(RegExp(r, "g"))
            if (rr == null) return
            let res: (string | boolean)[][] = [], i: (string | boolean)[], tag: string, idx = 0,
                items = Array.from(rr)
            for (let m of items) {
                idx += m.length
                i = Array.from(m.match(r))
                tag = i[2] as string
                res.push(i
                    .slice(0, 2).concat([ tag.includes("!"), tag.includes("?") ])
                    .concat((i[3] as string).replace(/ {2}\n|\n{2}$/, ""))
                )
            }
            return {
                res: res,
                idx: idx
            }
        },
        map: [ null,
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

class Logger {
    log: string
    struct: LogStruct | string = new LogStruct()

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

    analyze() {
        let i = 0
        for (let n in logRule) {
            let z = logRule[n],
                r = z.matcher(this.log = this.log.substring(i))
            i = r.idx
            this.doMap(z.map, this.struct[n], r.res, keys)
        }
    }

    from(log: string, style: "commit"): Logger {
        this.log = log
        try { this.analyze() } catch (e) {
            this.struct = e
        }
        return this
    }

    to(style: "json") {
        return this.struct instanceof Error ? this.struct : JSON.stringify(this.struct)
    }

    test() {
        let s = ""
        for (let z in logRule) s += logRule[z].sample.substring(1)
        console.log(logger.from(s, "commit").to("json"))
    }
}

let logger = new Logger()
export default logger

// Debug:
// logger.test()
