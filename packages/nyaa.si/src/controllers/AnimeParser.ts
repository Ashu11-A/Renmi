import { getAllCountries } from 'country-locale-map'

export interface AnimeFileInfo {
    submitter?: string
    seriesName?: string
    season?: string
    episode?: string
    resolution?: string
    videoEncoder?: string[]
    videoType?: string[]
    fileFormat?: string
    audioInfo?: string[]
    subtitlesInfo?: string[]
    audioLanguage?: string
    fileId?: string
    videoLanguage?: string
    subtitleLanguages?: string[]
    duration?: string
    releaseType?: string
    bitDepth?: string
    distributor?: string
  }
  
export class AnimeParser {
  private patterns = {
    submitter: /\[(.*?)\]/,
    seriesName: /^(?:\[[^\]]*\]\s*)?(.+?)(?:\s-\s|\sS\d{2}|\s\d{3,4}p|\s\[|\(\d{3,4}x\d{3,4}\)|\.\w+$|\s\()/i,
    season: /\bS(\d{2})(?=E\d{2})/i,
    episode: /E(\d{2})\b|(?:\s-\s|Episode\s)(\d{1,3})(?=\s|\[|\(|\.|$)/i,
    resolution: /(\d{3,4}x\d{3,4}|\d{3,4}p)/i,
    videoEncoder: /(AV1|HEVC|H\.26[45]|x26[45]|h26[45]|AVC|10[-\s]?bits?|HEVC[-\s]?10bits?|HEVC x265 10Bit|Hi10P)/gi,
    videoType: /(BluRay|Remux|WEBRip|BD|BDRip|DVD-Rip|WEB-DL)/gi,
    fileFormat: /\.(mkv|mp4|avi)$/i,
    audioInfo: /(OPUS|AAC(?:2\.0)?|FLAC|DDP(?:5\.1)?|EAC3|E-AC-3|AC3)/gi,
    subtitlesInfo: /(Sub: Mult|Multi-Subs?|Subtitles|Multi)/gi,
    fileId: /\[([A-F0-9]{8})\]/,
    audioLanguage: /(DUAL|English Dub|SPA|ENG|Dual-Audio)/i,
    duration: /Duration:\s~(\d{2}:\d{2}:\d{2})/,
    releaseType: /\b(weekly|batch)\b/i,
    distributor: /\b(AMZN|Amazon|CR|Crunchyroll|NF|Netflix|Aniplus|Funimation|Hulu)\b/i,
  }
  
  parseMultiple(fileNames: string[]): AnimeFileInfo[] {
    return fileNames.map((fileName) => this.normalize(this.parse(fileName)))
  }
  
  parse(fileName: string): AnimeFileInfo {
    const info: AnimeFileInfo = {}
    let text = fileName.toLowerCase() // Texto que será limpo progressivamente
  
    // Extrair e remover submitter
    const matchSubmitter = fileName.match(this.patterns.submitter)
    if (matchSubmitter) {
      info.submitter = matchSubmitter[1]
      text = text.replace(this.patterns.submitter, '')
    }
  
    // Extrair e remover nome da série
    const seriesNameMatch = fileName.match(this.patterns.seriesName)
    if (seriesNameMatch) {
      info.seriesName = seriesNameMatch[1]?.trim()
      text = text.replace(this.patterns.seriesName, '')
    }
  
    // Extrair e remover temporada
    const seasonMatch = fileName.match(this.patterns.season)
    if (seasonMatch) {
      info.season = seasonMatch[1]
      text = text.replace(this.patterns.season, '')
    }
  
    // Extrair e remover episódio
    const episodeMatch = fileName.match(this.patterns.episode)
    if (episodeMatch) {
      info.episode = episodeMatch.filter((ep) => ep)[1]
      text = text.replace(this.patterns.episode, '')
    }
  
    // Extrair e remover resolução
    const resolutionMatch = fileName.match(this.patterns.resolution)
    if (resolutionMatch) {
      info.resolution = resolutionMatch[1]
      text = text.replace(this.patterns.resolution, '')
    }
  
    // Extrair e remover codificador de vídeo
    const videoEncoderMatches = fileName.match(this.patterns.videoEncoder)
    if (videoEncoderMatches) {
      info.videoEncoder = [...new Set(videoEncoderMatches.map((v) => v.trim()))]
      text = text.replace(new RegExp(this.patterns.videoEncoder.source, 'gi'), '')
    }
  
    // Extrair e remover tipo de vídeo
    const videoTypeMatches = fileName.match(this.patterns.videoType)
    if (videoTypeMatches) {
      info.videoType = [...new Set(videoTypeMatches.map((v) => v.trim()))]
      text = text.replace(new RegExp(this.patterns.videoType.source, 'gi'), '')
    }
  
    // Extrair e remover formato do arquivo
    const fileFormatMatch = fileName.match(this.patterns.fileFormat)
    if (fileFormatMatch) {
      info.fileFormat = fileFormatMatch[1]
      text = text.replace(this.patterns.fileFormat, '')
    }
  
    // Extrair e remover informações de áudio
    const audioInfoMatches = fileName.match(this.patterns.audioInfo)
    if (audioInfoMatches) {
      info.audioInfo = [...new Set(audioInfoMatches.map((v) => v.trim()))]
      text = text.replace(new RegExp(this.patterns.audioInfo.source, 'gi'), '')
    }
  
    // Extrair e remover ID do arquivo
    const fileIdMatch = fileName.match(this.patterns.fileId)
    if (fileIdMatch) {
      info.fileId = fileIdMatch[1]
      text = text.replace(this.patterns.fileId, '')
    }
  
    // Extrair e remover duração
    const durationMatch = fileName.match(this.patterns.duration)
    if (durationMatch) {
      info.duration = durationMatch[1]
      text = text.replace(this.patterns.duration, '')
    }
  
    // Extrair e remover tipo de lançamento
    const releaseTypeMatch = fileName.match(this.patterns.releaseType)
    if (releaseTypeMatch) {
      info.releaseType = releaseTypeMatch[1]?.toLowerCase()
      text = text.replace(this.patterns.releaseType, '')
    }
  
    // Extrair e remover distribuidora
    const distributorMatch = fileName.match(this.patterns.distributor)
    if (distributorMatch) {
      info.distributor = distributorMatch[1]
      text = text.replace(this.patterns.distributor, '')
    }

    console.log(text)
  
    // Processar idiomas das legendas usando o texto limpo
    const languages = new Set<string>()
    const regex = (value: string) => new RegExp(`(^|[^a-zA-Z0-9])${value}([^a-zA-Z0-9]|$)`, 'i')

    for (const country of getAllCountries()) {
      const keys = Object.keys(country) as (keyof typeof country)[]
    
      for (const key of keys) {
        if (country[key] === undefined) continue
        if (['continent', 'region', 'emojiU', 'latitude', 'longitude', 'numeric'].includes(key)) continue
        if (typeof country[key] === 'number') continue
    
        const content = Array.isArray(country[key])
          ? country[key].map((value) => String(value).toLowerCase())
          : country[key].toLowerCase()
    
        if (Array.isArray(content)) {
          content.forEach((value) => {
            if (value.length === 0) return

            [true, false].forEach((replace) => {
              const regexInstance = regex(value)
              const matches = (replace ? text.replaceAll('-', '_') : text).match(regexInstance)
        
              if (matches) {
                console.log(matches)
                const beforeMatch = matches[1] || '' // Conteúdo antes da palavra
                const afterMatch = matches[2] || ''  // Conteúdo depois da palavra

                if (beforeMatch.match(/[:\-_]/) || afterMatch.match(/[:\-_]/)) {
                  return
                }
    
                languages.add(country.default_locale)
              }
            })
          })
        } else {
          if (content.length === 0) continue
          [true, false].forEach((replace) => {
            const regexInstance = regex(content)
            const matches = (replace ? text.replaceAll('-', '_') : text).match(regexInstance)
      
            if (matches) {
              console.log(matches)
              const beforeMatch = matches[1] || '' // Conteúdo antes da palavra
              const afterMatch = matches[2] || ''  // Conteúdo depois da palavra

              if (beforeMatch.match(/[:\-_]/) || afterMatch.match(/[:\-_]/)) {
                return
              }
  
              languages.add(country.default_locale)
            }
          })
        }
      }
    }
    
    info.subtitleLanguages = Array.from(languages.values())
  
    return info
  }  
  
  normalize(info: AnimeFileInfo): AnimeFileInfo {
    // Normalizar codificadores de vídeo
    if (info.videoEncoder) {
      const bitDepths: string[] = []
      info.videoEncoder = info.videoEncoder.filter((encoder) => {
        if (/10[-\s]?bits?|hi10p/i.test(encoder)) {
          bitDepths.push('10bit')
          return false // Remove do videoEncoder
        }
        return true
      }).map((encoder) => {
        if (/x264|h\.264|avc/i.test(encoder)) return 'h264'
        if (/hevc|x265|h\.265/i.test(encoder)) return 'hevc'
        return encoder.toLowerCase()
      })
  
      if (bitDepths.length > 0) {
        info.bitDepth = bitDepths[0] // Adiciona bitDepth
      }
    }
  
    // Normalizar distribuidora
    if (info.distributor) {
      const distributorMap: { [key: string]: string } = {
        AMZN: 'Amazon',
        Amazon: 'Amazon',
        CR: 'Crunchyroll',
        Crunchyroll: 'Crunchyroll',
        NF: 'Netflix',
        Netflix: 'Netflix',
        Aniplus: 'Aniplus',
        Funimation: 'Funimation',
        Hulu: 'Hulu',
      }
      info.distributor = distributorMap[info.distributor.toUpperCase()] || info.distributor
    }
  
    // Normalizar áudio
    if (info.audioInfo) {
      info.audioInfo = info.audioInfo.map((audio) =>
        audio.toLowerCase().replace(/aac(?:2\.0)?/i, 'aac')
      )
    }
  
    // Normalizar tipo de vídeo
    if (info.videoType) {
      info.videoType = info.videoType.map((type) =>
        type.toLowerCase().replace(/bd/i, 'bdrip')
      )
    }
  
    return info
  }
}

const parsed = new AnimeParser().parseMultiple([
  'DAN DA DAN S01 MULTi 1080p WEB x264 AAC -Tsundere-Raws (CUSTOM) (VF, FRENCH, VOSTFR, Multi-Audio)',
  '[Anipakku] Dandadan (01-12) [WEB-DL AMZN 1080p H.264 DDP][Multi-Áudio][PT-BR] (DAN DA DAN | S01 | Dublado)',
  'Re ZERO Starting Life in Another World S03E08 The Person Ill Fall for Someday 1080p BILI WEB-DL AAC2.0 H 264-VARYG (Re:Zero kara Hajimeru Isekai Seikatsu 3rd Season, Multi-Subs)',
  '[MagicStar] Kurosagi 2022 [WEBDL] [1080p] [AMZN] [JPN_ENG_CHT_SUB]'
])

console.log(parsed)