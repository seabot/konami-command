// ==UserScript==
// @name         mb. ALL LINKS
// @version      2016.5.29
// @changelog    https://github.com/jesus2099/konami-command/commits/master/mb_ALL-LINKS.user.js
// @description  Hidden links include fanpage, social network, etc. (NO duplicates) Generated autolinks (configurable) includes plain web search, auto last.fm, Discogs and LyricWiki searches, etc. Shows begin/end dates on URL and provides edit link. Expands Wikidata links to wikipedia articles.
// @homepage     http://userscripts-mirror.org/scripts/show/108889
// @supportURL   https://github.com/jesus2099/konami-command/labels/mb_ALL-LINKS
// @compatible   opera(12.18.1872)+violentmonkey  my setup
// @compatible   firefox(39)+greasemonkey         tested sometimes
// @compatible   chromium(46)+tampermonkey        tested sometimes
// @compatible   chrome+tampermonkey              should be same as chromium
// @namespace    https://github.com/jesus2099/konami-command
// @downloadURL  https://github.com/jesus2099/konami-command/raw/master/mb_ALL-LINKS.user.js
// @updateURL    https://github.com/jesus2099/konami-command/raw/master/mb_ALL-LINKS.user.js
// @author       PATATE12
// @licence      CC BY-NC-SA 3.0 (https://creativecommons.org/licenses/by-nc-sa/3.0/)
// @since        2011-08-02
// @icon         data:image/gif;base64,R0lGODlhEAAQAMIDAAAAAIAAAP8AAP///////////////////yH5BAEKAAQALAAAAAAQABAAAAMuSLrc/jA+QBUFM2iqA2ZAMAiCNpafFZAs64Fr66aqjGbtC4WkHoU+SUVCLBohCQA7
// @require      https://greasyfork.org/scripts/10888-super/code/SUPER.js?version=125133&v=2016.5.11
// @grant        none
// @include      http*://*mbsandbox.org/area/*
// @include      http*://*mbsandbox.org/artist/*
// @include      http*://*mbsandbox.org/event/*
// @include      http*://*mbsandbox.org/instrument/*
// @include      http*://*mbsandbox.org/label/*
// @include      http*://*mbsandbox.org/place/*
// @include      http*://*mbsandbox.org/recording/*
// @include      http*://*mbsandbox.org/release/*
// @include      http*://*mbsandbox.org/release-group/*
// @include      http*://*mbsandbox.org/series/*
// @include      http*://*mbsandbox.org/url/*
// @include      http*://*mbsandbox.org/work/*
// @include      http*://*musicbrainz.org/area/*
// @include      http*://*musicbrainz.org/artist/*
// @include      http*://*musicbrainz.org/event/*
// @include      http*://*musicbrainz.org/instrument/*
// @include      http*://*musicbrainz.org/label/*
// @include      http*://*musicbrainz.org/place/*
// @include      http*://*musicbrainz.org/recording/*
// @include      http*://*musicbrainz.org/release/*
// @include      http*://*musicbrainz.org/release-group/*
// @include      http*://*musicbrainz.org/series/*
// @include      http*://*musicbrainz.org/url/*
// @include      http*://*musicbrainz.org/work/*
// @include      http://*.mbsandbox.org/release/*
// @exclude      *//*/*mbsandbox.org/*
// @exclude      *//*/*musicbrainz.org/*
// @exclude      *//*mbsandbox.org/*/*add*
// @exclude      *//*mbsandbox.org/*/*annotat*
// @exclude      *//*mbsandbox.org/*/*create*
// @exclude      *//*mbsandbox.org/*/*delete*
// @exclude      *//*mbsandbox.org/*/*edit*
// @exclude      *//*mbsandbox.org/*/*merge*
// @exclude      *//*mbsandbox.org/*/*remove*
// @exclude      *//*mbsandbox.org/*/*split*
// @exclude      *//*mbsandbox.org/*/*/*add*
// @exclude      *//*mbsandbox.org/*/*/*annotat*
// @exclude      *//*mbsandbox.org/*/*/*create*
// @exclude      *//*mbsandbox.org/*/*/*delete*
// @exclude      *//*mbsandbox.org/*/*/*edit*
// @exclude      *//*mbsandbox.org/*/*/*merge*
// @exclude      *//*mbsandbox.org/*/*/*remove*
// @exclude      *//*mbsandbox.org/*/*/*split*
// @exclude      *//*musicbrainz.org/*/*add*
// @exclude      *//*musicbrainz.org/*/*annotat*
// @exclude      *//*musicbrainz.org/*/*create*
// @exclude      *//*musicbrainz.org/*/*delete*
// @exclude      *//*musicbrainz.org/*/*edit*
// @exclude      *//*musicbrainz.org/*/*merge*
// @exclude      *//*musicbrainz.org/*/*remove*
// @exclude      *//*musicbrainz.org/*/*split*
// @exclude      *//*musicbrainz.org/*/*/*add*
// @exclude      *//*musicbrainz.org/*/*/*annotat*
// @exclude      *//*musicbrainz.org/*/*/*create*
// @exclude      *//*musicbrainz.org/*/*/*delete*
// @exclude      *//*musicbrainz.org/*/*/*edit*
// @exclude      *//*musicbrainz.org/*/*/*merge*
// @exclude      *//*musicbrainz.org/*/*/*remove*
// @exclude      *//*musicbrainz.org/*/*/*split*
// @run-at       document-end
// ==/UserScript==
"use strict";
/* hint for Opera 12 users allow opera:config#UserPrefs|Allowscripttolowerwindow and opera:config#UserPrefs|Allowscripttoraisewindow */
var userjs = "jesus2099_all-links_";
var nonLatinName = /[\u0384-\u1cf2\u1f00-\uffff]/; // U+2FA1D is currently out of js range
var extlinksOpacity = "1";
var autolinksOpacity = ".5";
var rawLanguages = JSON.parse(localStorage.getItem(userjs + "languages")) || ["navigator", "musicbrainz"];
// Available tokens:
// - for all entity pages: %entity-type% %entity-mbid% %entity-name%
// - for "that" type entity pages: %that-mbid% %that-name% where "that" is an entity type in the above @include list
// - for artist entity pages: %artist-sort-name% %artist-family-name-first% %artist-latin-script-name%
// - for url entity pages: %url-target% (while %entity-name% and %url-name% are deliberately ignored)
var autolinks = {
	user: JSON.parse(localStorage.getItem(userjs + "user-autolinks")) || {},
	default: {
		"Web pages": "//duckduckgo.com/?q=%entity-name%",
		"Web pages (strict)": "//duckduckgo.com/?q=%2B%22%entity-name%%22",
		"Images": "//duckduckgo.com/?q=%entity-name%+!i",
		"Videos": "//duckduckgo.com/?q=%entity-name%+!v",
		"Credits": null,
		"SACEM (Interprète)": {
			acceptCharset: "ISO-8859-1",
			action: "http://www.sacem.fr/oeuvres/oeuvre/rechercheOeuvre.do",
			parameters: {
				"ftin": "true",
				"tiers": "%artist-name%"
			}
		},
		"SACEM (Auteur‐Compositeur‐Éditeur)": {
			acceptCharset: "ISO-8859-1",
			action: "http://www.sacem.fr/oeuvres/oeuvre/rechercheOeuvre.do",
			parameters: {
				"ftad": "true",
				"tiers": "%artist-name%"
			}
		},
		"JASRAC（アーティスト）": {
			title: "requires JASRAC direct link",
			method: "post",
			acceptCharset: "Shift_JIS",
			enctype: "multipart/form-data",
			action: "http://www2.jasrac.or.jp/eJwid/main.jsp?trxID=A00401-3",
			parameters: {
				"IN_ARTIST_NAME_OPTION1": "0",
				"IN_ARTIST_NAME1": "%artist-name%",
				"IN_DEFAULT_WORKS_KOUHO_MAX": "100",
				"IN_DEFAULT_WORKS_KOUHO_SEQ": "1",
				"IN_DEFAULT_SEARCH_WORKS_NAIGAI": "0",
				"RESULT_CURRENT_PAGE": "1"
			}
		},
		"JASRAC（著作者）": {
			title: "requires JASRAC direct link",
			method: "post",
			acceptCharset: "Shift_JIS",
			enctype: "multipart/form-data",
			action: "http://www2.jasrac.or.jp/eJwid/main.jsp?trxID=A00401-3",
			parameters: {
				"IN_KEN_NAME_OPTION1": "0",
				"IN_KEN_NAME1": "%artist-family-name-first%",
				"IN_KEN_NAME_JOB1": "0",
				"IN_DEFAULT_WORKS_KOUHO_MAX": "100",
				"IN_DEFAULT_WORKS_KOUHO_SEQ": "1",
				"IN_DEFAULT_SEARCH_WORKS_NAIGAI": "0",
				"RESULT_CURRENT_PAGE": "1"
			}
		},
		"音楽の森（アーティスト）": "//www.minc.gr.jp/db/ArtNmSrch.aspx?ArtNm=%artist-name%",
		"音楽の森（著作者）": "//www.minc.gr.jp/db/KenriSrch.aspx?KENRISYANM=%artist-family-name-first%",
		"Lyrics": null,
		"decoda": "http://decoda.com/search?q=%artist-name%",
		"LyricWiki": "//lyrics.wikia.com/%artist-name%",
		"うたまっぷ（アーティスト）": {
			acceptCharset: "euc-jp",
			action: "http://www.utamap.com/searchkasi.php",
			parameters: {
				"searchname": "artist",
				"word": "%artist-name%"
			}
		},
		"うたまっぷ（作詞者）": {
			acceptCharset: "euc-jp",
			action: "http://www.utamap.com/searchkasi.php",
			parameters: {
				"searchname": "sakusi",
				"word": "%artist-name%"
			}
		},
		"うたまっぷ（作曲者）": {
			acceptCharset: "euc-jp",
			action: "http://www.utamap.com/searchkasi.php",
			parameters: {
				"searchname": "sakyoku",
				"word":"%artist-name%"
			}
		},
		"J-Lyric（歌手）": "http://j-lyric.net/index.php?ka=%artist-name%",
		"歌詞タイム": "//duckduckgo.com/?q=site%3Akasi-time.com+subcat+intitle:%artist-name%",
		"Japanese stuff": null,
		"VGMdb": "http://vgmdb.net/search?q=%artist-name%",
		"ja.Wikipedia": "//ja.wikipedia.org/w/index.php?search=%artist-name%",
		"CDJournal search": {
			acceptCharset: "euc-jp",
			action: "https://cdjournal.com/search/do/",
			parameters: {
				"k": "%artist-name%",
				"target": "a"
			}
		},
		"Joshinweb search": {
			acceptCharset: "Shift_JIS",
			action: "//joshinweb.jp/cdshops/Dps",
			parameters: {
				"KEY": "ARTIST",
				"FM": "0",
				"KEYWORD": "%artist-name%"
			}
		},
		"Yunisan": "//duckduckgo.com/?q=site:www22.big.or.jp+%22%2F%7Eyunisan%2Fvi%2F%22+%artist-name%",
		"VKDB": "//duckduckgo.com/?q=site:vkdb.jp+%artist-name%",
		"Vietnamese stuff": null,
		"vi.Wikipedia": "//vi.wikipedia.org/w/index.php?search=%artist-name%",
		"nhạc số": "http://nhacso.net/tim-kiem-nghe-si.html?keyName=%artist-name%",
		"Korean stuff": null,
		"maniadb": "http://www.maniadb.com/search.asp?sr=PO&q=%artist-name%",
		"Other databases": null,
		"AllMusic": "http://www.allmusic.com/search/artist/%artist-name%",
		"Discogs": "http://www.discogs.com/search?q=%artist-name%&type=artist",
		"ISNI": "//isni.oclc.nl/xslt/CMD?ACT=SRCHA&IKT=8006&TRM=%artist-name%",
		"Rate Your Music": "//rateyourmusic.com/search?searchtype=a&searchterm=%artist-name%", 
		"Second hand songs": "http://secondhandsongs.com/search?search_text=%artist-name%",
		"WhoSampled": "//www.whosampled.com/search/artists/?h=1&q=%artist-name%", 
		"Other stuff": null,
		"en.Wikipedia": "//en.wikipedia.org/w/index.php?search=%artist-name%",
		"*.Wikipedia": "//duckduckgo.com/?q=site:wikipedia.org+%22%artist-name%%22",
		"Lastfm (mbid)": "http://last.fm/mbid/%artist-id%",
		"Lastfm (name)": "http://last.fm/music/%artist-name%",
		"BBC Music": "http://www.bbc.co.uk/music/artists/%artist-id%",
	}
};
var enabledDefaultAutolinks = {};
var loadedSettings = JSON.parse(localStorage.getItem(userjs + "enabled-default-autolinks")) || {};
for (var link in autolinks.default) if (autolinks.default.hasOwnProperty(link)) {
	enabledDefaultAutolinks[link] = typeof loadedSettings[link] != "undefined" ? loadedSettings[link] : true;
}
var webSearchLinks = {
	title: {
		en: "Search the web",
		de: "Durchsuchen das Web",
		fr: "Chercher sur le Web",
		nl: "Zoeken op het Web",
	},
	items: {
		webPageSearch: {
			title: {en: "Web pages", de: "Webseiten", fr: "Pages Web", nl: "Webpagina’s"},
			target: "//duckduckgo.com/?q=%entity-name%"
		},
		webPageSearchPlusQuotes: {
			title: {en: "Web pages (exact)", de: "Webseiten (genaue)", fr: "Pages Web (exacte)", nl: "Webpagina’s (exacten)"},
			target: [
				"//duckduckgo.com/?q=%2B%22%entity-name%%22",
				"//duckduckgo.com/?q=%2B%22%url-target%%22"
			]
		},
		imageSearch: {
			title: {en: "Images", de: "Bilder", fr: "Images", nl: "Afbeeldingen"},
			target: "//duckduckgo.com/?q=%entity-name%+!i"
		},
		videoSearch: {
			title: {en: "Videos", de: "Videos", fr: "Vidéos", nl: "Video’s"},
			target: "//duckduckgo.com/?q=%entity-name%+!v"
		},
		waybackMachineHistory: {
			title: {en: "Archive history", de: "Archivgeschichte", fr: "Historique d'archivage", nl: "Archiefgeschiedenis"},
			target: "//web.archive.org/web/*/%url-target%"
		}
	}
};
var whitelistSearchLinks = {
	title: {
		de: "Durchsuchen in die weiße Liste",
		en: "Search in the whitelist",
		fr: "Chercher dans la liste blanche",
		nl: "Zoeken in de witte lijst",
	},
	items: {
		lyricsDBs: {
			title: {
				de: "Liedtext",
				en: "Lyrics",
				fr: "Paroles",
				nl: "Liedtekst",
			},
			items: {
				lyricWikia: {
					title: {en: "LyricWikia"},
					target: {en: "http://lyrics.wikia.com/wiki/Special:Search?search=%work-name%"}
				},
			}
		},
		regionalDBs: {
			title: {
				de: "Pro Gebiet",
				en: "By area",
				fr: "Par région",
				nl: "Per Gebied",
			},
			items: {
				DE: {
					title: {
						de: "Deutschland",
						en: "Germany",
						fr: "Allemagne",
						nl: "Duitsland",
					},
					items: {
						musikSammler: {
							title: {de: "Musik-Sammler.de"},
							target: [
								{de: "https://www.musik-sammler.de/search/%artist-name%/?q=artist"},
								{de: "https://www.musik-sammler.de/search/%release-name%/?q=medium"},
								{de: "https://www.musik-sammler.de/search/%release-group-name%/?q=album"}
							]
						},
						dnbMusikarchiv: {
							title: {de: "DNB - Deutsches Musikarchiv"},
							target: {de: "https://portal.dnb.de/opac.htm?query=%28mat%3DMusic+OR+cod%3Dmt%29+AND+%release-name%&method=simpleSearch&cqlMode=true"}
						},
					}
				},
				FR: {
					title: {
						de: "Frankreich",
						en: "France",
						fr: "France",
						nl: "Frankrijk",
					},
					items: {
						encyclopedisque: {
							title: {fr: "Encyclopédisque"},
							target: [
								{fr: "http://www.encyclopedisque.fr/recherche.html?ra=%artist-name%&sp=1#resultat"},
								{fr: "http://www.encyclopedisque.fr/recherche.html?rd=%release-name%&sp=1#resultat"}
							]
						},
					}
				},
			}
		},
		otherDBs: {
			title: {
				de: "Andere Datenbanken",
				en: "Other databases",
				fr: "Autres bases de données",
				nl: "Andere databases",
			},
			items: {
				lastfmMBID: {
					title: {en: "Last.fm (MBID)"},
					target: {
						"en": "http://last.fm/mbid/%artist-mbid%",
						"de es fr it ja pl pt ru sv tr zh": "http://last.fm/%language%/mbid/%artist-mbid%",
					},
					multilingualKeys: true
				},
				lastfmName: {
					title: {en: "Last.fm (name)",	de: "Last.fm (Name)", es: "Last.fm (nombre)", fr: "Last.fm (nom)", it: "Last.fm (Nome)", ja: "Last.fm (名)", pl: "Last.fm (Nazwa)", pt: "Last.fm (nome)", ru: "Last.fm (имя)", sv: "Last.fm (namn)", tr: "Last.fm (ad)", zh: "Last.fm (名)"},
					target: {
						"en": "http://last.fm/search?q=%artist-name%",
						"de es fr it ja pl pt ru sv tr zh": "http://last.fm/%language%/search?q=%artist-name%",
					},
					multilingualKeys: true
				},
			}
		}
	}
};
var additionalSearchLinks = {
	title: {
		de: "Durchsuchen noch mehr",
		en: "Search further",
		fr: "Chercher plus loin",
		nl: "Zoeken verder naar",
	},
	items: {
		lyricsDBs: {
			title: {
				de: "Liedtext",
				en: "Lyrics",
				fr: "Paroles",
				nl: "Liedtekst",
			},
			items: {
				lyricWikiaFR: {
					title: {fr: "WikiParoles"},
					target: {fr: "http://fr.lyrics.wikia.com/wiki/Special:Search?search=%work-name%"}
				},
			}
		},
		regionalDBs: {
			title: {
				de: "Pro Gebiet",
				en: "By area",
				fr: "Par région",
				nl: "Per Gebied",
			},
			items: {
				FR: {
					title: {
						de: "Frankreich",
						en: "France",
						fr: "France",
						nl: "Frankrijk",
					},
					items: {
						sacem: {
							title: {fr: "SACEM"},
							target: {
								fr: "https://repertoire.sacem.fr/resultats?filters=titles&query=%work-name%#searchBtn",
								en: "https://repertoire.sacem.fr/en/results?filters=titles&query=%work-name%#searchBtn",
							}
						},
						sacemWorks: {
							title: {fr: "SACEM (œuvres)", en: "SACEM (works)"},
							target: [
								{
									fr: "https://repertoire.sacem.fr/resultats?filters=parties&query=%artist-name%#searchBtn",
									en: "https://repertoire.sacem.fr/en/results?filters=parties&query=%artist-name%#searchBtn",
								}, {
									fr: "https://repertoire.sacem.fr/resultats?filters=parties&query=%label-name%#searchBtn",
									en: "https://repertoire.sacem.fr/en/results?filters=parties&query=%label-name%#searchBtn",
								}
							]
						},
					}
				},
			}
		},
	},
};
var searchLinks = {items: {
	web: webSearchLinks,
	whitelist: whitelistSearchLinks,
	additional: additionalSearchLinks,
}};
var disabledSearchLinks = {};
var faviconClasses = { // https://github.com/metabrainz/musicbrainz-server/blob/61960dd9ebd5b77c6f1199815160e63b3383437e/lib/MusicBrainz/Server/Entity/URL/Sidebar.pm
	"amazon"                    : "amazon",
	"allmusic.com"              : "allmusic",
	"animenewsnetwork.com"      : "animenewsnetwork",
	"wikipedia.org"             : "wikipedia",
	"facebook.com"              : "facebook",
	"generasia.com"             : "generasia",
	"last.fm"                   : "lastfm",
	"myspace.com"               : "myspace",
	"twitter.com"               : "twitter",
	"youtube.com"               : "youtube",
	"discogs.com"               : "discogs",
	"secondhandsongs.com"       : "secondhandsongs",
	"songfacts.com"             : "songfacts",
	"soundcloud.com"            : "soundcloud",
	"ibdb.com"                  : "ibdb",
	"imdb.com"                  : "imdb",
	"imslp.org"                 : "imslp",
	"instagram.com"             : "instagram",
	"ester.ee"                  : "ester",
	"worldcat.org"              : "worldcat",
	"45cat.com"                 : "fortyfivecat",
	"rateyourmusic.com"         : "rateyourmusic",
	"rolldabeats.com"           : "rolldabeats",
	"psydb.net"                 : "psydb",
	"metal-archives.com"        : "metalarchives",
	"spirit-of-metal.com"       : "spiritofmetal",
	"theatricalia.com"          : "theatricalia",
	"whosampled.com"            : "whosampled",
	"ocremix.org"               : "ocremix",
	"musik-sammler.de"          : "musiksammler",
	"encyclopedisque.fr"        : "encyclopedisque",
	"nla.gov.au"                : "trove",
	"rockensdanmarkskort.dk"    : "rockensdanmarkskort",
	"rockinchina.com"           : "ric",
	"rockipedia.no"             : "rockipedia",
	"vgmdb.net"                 : "vgmdb",
	"viaf.org"                  : "viaf",
	"vk.com"                    : "vk",
	"vkdb.jp"                   : "vkdb",
	"dhhu.dk"                   : "dhhu",
	"thesession.org"            : "thesession",
	"plus.google.com"           : "googleplus",
	"openlibrary.org"           : "openlibrary",
	"bandcamp.com"              : "bandcamp",
	"play.google.com"           : "googleplay",
	"itunes.apple.com"          : "itunes",
	"spotify.com"               : "spotify",
	"soundtrackcollector.com"   : "stcollector",
	"wikidata.org"              : "wikidata",
	"lieder.net"                : "lieder",
	"loudr.fm"                  : "loudr",
	"genius.com"                : "genius",
	"imvdb.com"                 : "imvdb",
	"residentadvisor.net"       : "residentadvisor",
	"d-nb.info"                 : "dnb",
	"iss.ndl.go.jp"             : "ndl",
	"ci.nii.ac.jp"              : "cinii",
	"finnmusic.net"             : "finnmusic",
	"fono.fi"                   : "fonofi",
	"stage48.net"               : "stage48",
	"tedcrane.com/dancedb"      : "dancedb",
	"finna.fi"                  : "finna",
	"mainlynorfolk.info"        : "mainlynorfolk",
	"bibliotekapiosenki.pl"     : "piosenki",
	"qim.com"                   : "quebecinfomusique",
	"thedancegypsy.com"         : "thedancegypsy",
	"videogam.in"               : "videogamin",
	"spirit-of-rock.com"        : "spiritofrock",
	"tunearch.org"              : "tunearch",
	"castalbums.org"            : "castalbums",
	"smdb.kb.se"                : "smdb",
	"triplejunearthed.com"      : "triplejunearthed",
	"cdbaby.com"                : "cdbaby",
};
var favicons = {
	"lastfm.": "//musicbrainz.org/static/images/favicons/lastfm-16.png",
	"livedoor.jp": "http://blog.livedoor.jp/favicon.ico",
	"rakuten.co.jp": "//plaza.rakuten.co.jp/favicon.ico",
	"yahoo.": "http://blogs.yahoo.co.jp/favicon.ico",
};
var favicontry = [];
var guessOtherFavicons = true;
var sidebar = document.getElementById("sidebar");
var tokenValues = {};
var entityUrlRelsWS = "/ws/2/%entity-type%/%entity-mbid%?inc=url-rels";
var existingLinks, extlinks;
document.head.appendChild(document.createElement("style")).setAttribute("type", "text/css");
var j2css = document.styleSheets[document.styleSheets.length - 1];
j2css.insertRule("ul.external_links > li.defaultAutolink > input[type='checkbox'] { display: none; }", 0);
j2css.insertRule("ul.external_links > li.defaultAutolink.disabled { text-decoration: line-through; display: none; }", 0);
j2css.insertRule("ul.external_links.configure > li.defaultAutolink.disabled { display: list-item; }", 0);
j2css.insertRule("ul.external_links.configure > li.defaultAutolink > input[type='checkbox'] { display: inline; }", 0);
j2css.insertRule("div#sidebar > ." + userjs + "searchLinks.emptySection { display: none; }", 0);
j2css.insertRule("div#sidebar > ." + userjs + "searchLinks li.emptySection { display: none; }", 0);
j2css.insertRule("div#sidebar > ." + userjs + "searchLinks input[type='checkbox'] { display: none; }", 0);
j2css.insertRule("div#sidebar > ." + userjs + "searchLinks.disabled { text-decoration: line-through; display: none; }", 0);
j2css.insertRule("div#sidebar > ." + userjs + "searchLinks .disabled { text-decoration: line-through; display: none; }", 0);
j2css.insertRule("div#sidebar > .configure." + userjs + "searchLinks.emptySection { display: block; }", 0);
j2css.insertRule("div#sidebar > .configure." + userjs + "searchLinks li.emptySection { display: list-item; }", 0);
j2css.insertRule("div#sidebar > .configure." + userjs + "searchLinks input[type='checkbox'] { display: inline; }", 0);
j2css.insertRule("div#sidebar > .configure." + userjs + "searchLinks.disabled { display: block; }", 0);
j2css.insertRule("div#sidebar > ul.configure." + userjs + "searchLinks.disabled { display: none; }", 0);
j2css.insertRule("div#sidebar > .configure." + userjs + "searchLinks li.disabled { display: list-item; }", 0);
j2css.insertRule("div#sidebar > .configure." + userjs + "searchLinks ul.disabled { display: none; }", 0);
j2css.insertRule("div#sidebar > ." + userjs + "searchLinks h3 { margin: 0; }", 0);
j2css.insertRule("div#sidebar > ." + userjs + "searchLinks h4 { margin: 0; }", 0);
j2css.insertRule("div#sidebar > ul." + userjs + "userLinks > li.subsectionHeader { font-weight: 'bold'; padding: '0px'; float: 'right'; }", 0);
var hrStyle = {css: ""};
main();
for (var s = 0; s < document.styleSheets.length; s++) {
	for (var r = 0; r < document.styleSheets[s].cssRules.length - 1; r++) {
		if (hrStyle.match = document.styleSheets[s].cssRules[r].cssText.match(/(#sidebar.+ul.+hr) {(.+)}/)) {
			hrStyle.css += hrStyle.match[2];
		}
	}
}
if (hrStyle.css) {
	j2css.insertRule("div#sidebar ul.external_links hr { margin-top: 8px !important; width: inherit !important; " + hrStyle.css + "}", 0);
}
function main() {
	if (sidebar) {
		var entityMatch = self.location.href.match(/\/([a-z\-]*)\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}).*/i);
		var entityType = tokenValues["%entity-type%"] = entityMatch[1];
		var entityMBID = tokenValues["%entity-mbid%"] = entityMatch[2];
		tokenValues["%" + entityType + "-mbid%"] = entityMBID;
		/* Hidden links and autolinks */
		if (entityType && entityMBID) {
			// Tokens for autolinks
			var entityHeaderClass = (entityType === "release-group" ? "rg" : entityType) + "header";
			var entityNameNode = document.querySelector("div#content > div." + entityHeaderClass + " > h1 a, div#content > div." + entityHeaderClass + " > h1 span[href]"); /* for compatibilly with https://gist.github.com/jesus2099/4111760 */
			if (entityNameNode) {
				var entityName = tokenValues["%entity-name%"] = entityNameNode.textContent.trim();
				tokenValues["%" + entityType + "-name%"] = entityName;
				if (entityType == "artist") {
					var artistid = tokenValues["%artist-id"] = entityMBID; /* for user links backward compatibility */
					var artistname = entityName;
					var artistsortname, artistsortnameSwapped = "";
					artistsortname = tokenValues["%artist-sort-name%"] = entityNameNode.getAttribute("title");
					if (!artistname.match(nonLatinName)) {
						tokenValues["%artist-family-name-first%"] = artistsortname;
						tokenValues["%artist-latin-script-name%"] = artistname;
					} else {
						var tmpsn = artistsortname.split(",");
						for (var isn = tmpsn.length - 1; isn >= 0; isn--) {
							artistsortnameSwapped += tmpsn[isn].trim();
							if (isn != 0) {
								artistsortnameSwapped += " ";
							}
						}
						tokenValues["%artist-family-name-first%"] = artistname;
						tokenValues["%artist-latin-script-name%"] = artistsortnameSwapped;
					}
				} else if (entityType == "url") {
					delete tokenValues["%entity-name%"];
					delete tokenValues["%url-name%"];
					tokenValues["%url-target%"] = entityName;
				}
			}
			extlinks = sidebar.getElementsByClassName("external_links");
			if (extlinks && extlinks.length > 0) {
				extlinks = extlinks[0];
				// Hidden links
				entityUrlRelsWS = entityUrlRelsWS.replace(/%entity-type%/, entityType).replace(/%entity-mbid%/, entityMBID);
				addHiddenLinks();
				// Autolinks
				extlinksOpacity = autolinksOpacity;
				for (var defaultOrUser in autolinks) if (autolinks.hasOwnProperty(defaultOrUser)) {
					var haslinks = false;
					for (var link in autolinks[defaultOrUser]) if (autolinks[defaultOrUser].hasOwnProperty(link)) {
						var target = autolinks[defaultOrUser][link];
						var sntarget = null;
						if (target) {
							if (typeof target == "string") {
								if (target.match(/%artist-name%/) && artistname != artistsortnameSwapped && artistname.match(nonLatinName)) {
									sntarget = target.replace(/%artist-name%/, encodeURIComponent(artistsortnameSwapped));
								}
								target = replaceAllTokens(target);
								if (!target) continue;
							} else {
								var latinScriptOnly = target.acceptCharset.match(/iso-8859/i);
								var skippedToken = false;
								for (var param in target.parameters) if (target.parameters.hasOwnProperty(param)) {
									if (latinScriptOnly)
										target.parameters[param] = target.parameters[param].replace(/%artist-name%/, "%artist-latin-script-name%");
									target.parameters[param] = replaceAllTokens(target.parameters[param]);
									if (!target.parameters[param]) { skippedToken = true; break; }
								}
								if (skippedToken) continue;
							}
						}
						if (addExternalLink({text: link, target: target, sntarget: sntarget, enabledDefaultAutolink: enabledDefaultAutolinks[link]})) {
							if (!haslinks) {
								haslinks = true;
								addExternalLink({text: " " + defaultOrUser.substr(0, 1).toUpperCase() + defaultOrUser.substr(1).toLowerCase() + " autolinks"});
								extlinks.lastChild.previousSibling.appendChild(document.createTextNode(" "));
								extlinks.lastChild.previousSibling.appendChild(createTag("div", {a: {class: "icon img"}, s: {backgroundImage: "url(/static/images/icons/cog.png)"}}, createTag("a", {a: {title: "configure " + defaultOrUser + " autolinks"}, s: {color: "transparent"}, e: {click: configureModule}}, "configure")));
							}
						}
					}
				}
			}
			loadDisabledSearchLinks();
			for (var sectionKey in searchLinks.items) if (searchLinks.items.hasOwnProperty(sectionKey)) {
				addSearchLinksSection([sectionKey], sidebar);
			}
			addUserLinks();
		}
		/* Wikidata to Wikipedia */
		if (rawLanguages && Array.isArray(rawLanguages) && rawLanguages.length > 0) {
			var languages = parseLanguages(rawLanguages);
			var wikidatas = sidebar.querySelectorAll("ul.external_links > li a[href*='wikidata.org/wiki/Q']");
			for (var wd = 0; wd < wikidatas.length; wd++) {
				var wikidataID = wikidatas[wd].getAttribute("href").match(/Q\d+$/);
				if (wikidataID) {
					if (!wikidatas[wd].parentNode.querySelector("a.edit-languages")) {
						addAfter(createTag("div", {a: {class: "icon img"}, s: {backgroundImage: "url(/static/images/icons/cog.png)", opacity: ".5"}}, createTag("a", {a: {class: "edit-languages", title: "choose wikipedia languages"}, s: {color: "transparent"}, e: {click: configureModule}}, "choose wikipedia languages")), wikidatas[wd]);
						addAfter(document.createTextNode(" "), wikidatas[wd]);
					}
					var xhr = new XMLHttpRequest();
					xhr.id = wikidataID[0];
					getParent(wikidatas[wd], "li").classList.add(userjs + "-wd-" + xhr.id);
					wikidatas[wd].parentNode.appendChild(createTag("img", {a: {alt: "checking available wikipedia languages…", src: "/static/images/icons/loading.gif"}}));
					xhr.addEventListener("load", function(event) {
						var wikidataListItem = sidebar.querySelector("ul.external_links > li." + userjs + "-wd-" + this.id);
						removeNode(wikidataListItem.querySelector("img[src$='loading.gif']"));
						var wikidata = JSON.parse(this.responseText);
						if (wikidata && wikidata.entities && (wikidata = wikidata.entities[this.id])) {
							for (var languageCode = 0; languageCode < languages.length; languageCode++) {
								var wikiEntry = wikidata.sitelinks[languages[languageCode] + "wiki"];
								if (wikiEntry) {
									var href = wikiEntry.url.replace(/^https?:/, "");
									var ul;
									/*if (!existingLinks || !existingLinks[url]) {*/
									if (!extlinks.querySelector("li a[href$='" + href + "']")) {
										if (!ul) {
											ul = wikidataListItem.appendChild(createTag("ul", {s: {listStyle: "none"}}));
										}
										ul.appendChild(createTag("li", {a: {class: "wikipedia-favicon"}, s: {marginLeft: "-22px"}}, [languages[languageCode], ": ", createTag("a", {a: {href: href}}, wikiEntry.title)]));
									}
								}
							}
						}
					});
					xhr.open("get", "https://www.wikidata.org/wiki/Special:EntityData/" + xhr.id + ".json", true);
					xhr.send(null);
				}
			}
		}
	}
}
function addExternalLink(parameters/*text, target, begin, end, sntarget, mbid, enabledDefaultAutolink*/) {
	var newLink = true;
	var lis = extlinks.getElementsByTagName("li");
	if (!existingLinks) {
		existingLinks = [];
		for (var ilis = 0; ilis < lis.length; ilis++) {
			var lisas = lis[ilis].getElementsByTagName("a");
			if (lisas.length > 0) {
				existingLinks.push(lisas[0].getAttribute("href").trim().replace(/^https?:/, ""));
			}
		}
	}
	if (parameters.target) {
		// This is a link
		var li;
		if (typeof parameters.target != "string") {
			var form = createTag("form", {a: {action: parameters.target.action}});
			if (parameters.target.title) {
				form.style.setProperty("cursor", "help");
			}
			var info = "\r\n" + parameters.target.action;
			for (var attr in parameters.target) if (parameters.target.hasOwnProperty(attr)) {
				if (attr == "parameters") {
					for (var param in parameters.target.parameters) if (parameters.target.parameters.hasOwnProperty(param)) {
						info += "\r\n" + param + "=" + parameters.target.parameters[param];
						form.appendChild(createTag("input", {a: {name: param, type: "hidden", value: parameters.target.parameters[param]}}));
					}
				} else {
					if (attr.match(/acceptCharset|enctype|method/)) {
						info = parameters.target[attr] + " " + info;
					}
					form.setAttribute(attr.replace(/[A-Z]/g, "-$&").toLowerCase(), parameters.target[attr]);
				}
			}
			form.appendChild(createTag("a", {a: {title: info}, e: {
				click: function(event) {
					if (event.button == 0) {
						/* lame browsers ;) */
						if (typeof opera == "undefined") {
							if (event.shiftKey) {
								this.parentNode.setAttribute("target", "_blank");
							} else if (event.ctrlKey) {
								this.parentNode.setAttribute("target", weirdobg());
							}
						}
						this.parentNode.submit();
					}
				},
				mousedown: function(event) {
					event.preventDefault();
					if (event.button == 1) {
						this.parentNode.setAttribute("target", weirdobg());
						this.parentNode.submit();
					}
				}
			}}, parameters.text));
			form.appendChild(document.createTextNode("*"));
			li = createTag("li", {a: {ref: parameters.text}}, form);
		} else {
			var exi = existingLinks.indexOf(parameters.target.trim().replace(/^https?:/, ""));
			if (exi < 0) {
				existingLinks.push(parameters.target.trim().replace(/^https?:/, ""));
				li = createTag("li", {a: {ref: parameters.text}}, createTag("a", {a: {href: parameters.target}}, parameters.text));
			} else {
				newLink = false;
				li = lis[exi];
			}
			if (parameters.sntarget && newLink) {
				li.appendChild(document.createTextNode(" ("));
				li.appendChild(createTag("a", {a: {href: parameters.sntarget, title: "search with latin name"}}, "lat."));
				li.appendChild(document.createTextNode(")"));
			}
			if (parameters.begin || parameters.end) {
				var ardates = createTag("span", {s: {whiteSpace: "nowrap"}}, " (");
				if (!parameters.begin && parameters.end == "????") {
					ardates.appendChild(archivedDate(parameters.end, parameters.target));
				} else {
					if (parameters.begin) { ardates.appendChild(archivedDate(parameters.begin, parameters.target)); }
					if (parameters.begin != parameters.end) { ardates.appendChild(document.createTextNode("—")); }
					if (parameters.end && parameters.begin != parameters.end) { ardates.appendChild(archivedDate(parameters.end, parameters.target)); }
				}
				ardates.appendChild(document.createTextNode(")"));
				ardates.normalize();
				li.appendChild(ardates);
			}
			if (parameters.mbid) {
				addAfter(createTag("div", {a: {class: "icon img edit-item"}, s: {opacity: ".5"}}, createTag("a", {a: {title: "edit this URL relationship", href: "/url/" + parameters.mbid + "/edit"}, s: {color: "transparent"}}, "edit")), li.querySelector("a"));
				addAfter(document.createTextNode(" "), li.querySelector("a"));
			}
		}
		if (typeof parameters.enabledDefaultAutolink != "undefined") {
			li.classList.add("defaultAutolink");
			var cb = li.appendChild(createTag("input", {a: {type: "checkbox"}, e: {click: function(event) {
				this.parentNode.classList.toggle("disabled", !this.checked);
				var loadedSettings = JSON.parse(localStorage.getItem(userjs + "enabled-default-autolinks")) || {};
				if (this.checked) {
					delete loadedSettings[this.parentNode.getAttribute("ref")];
				} else {
					loadedSettings[this.parentNode.getAttribute("ref")] = false;
				}
				localStorage.setItem(userjs + "enabled-default-autolinks", JSON.stringify(loadedSettings));
			}}}));
			if (parameters.enabledDefaultAutolink === true) {
				cb.checked = true;
			} else if (parameters.enabledDefaultAutolink === false) {
				li.classList.add("disabled");
				cb.checked = false;
			}
		}
		setFavicon(li, (typeof parameters.target == "string") ? parameters.target : parameters.target.action);
	} else {
		// This is a header
		var li = createTag("li", {s: {fontWeight: "bold"}}, parameters.text);
		if (parameters.text.indexOf(" ") === 0) {
			// Level 1 header
			li.style.setProperty("padding-top", "0px");
			extlinks.insertBefore(li, extlinks.lastChild);
		} else {
			// Level 2 header
			li.style.setProperty("padding", "0px");
			li.style.setProperty("float", "right");
			extlinks.appendChild(li);
		}
		extlinks.insertBefore(document.createElement("hr"), li);
	}
	if (newLink) {
		li.style.setProperty("opacity", extlinksOpacity);
		if (parameters.target) { extlinks.appendChild(li); }
	}
	return newLink;
}
function addHiddenLinks() {
	loading(true);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(event) {
		if (this.readyState == 4) {
			if (this.status == 200) {
				loading(false);
				var res = this.responseXML;
				var url, urls = res.evaluate("//mb:relation-list[@target-type='url']/mb:relation", res, nsr, XPathResult.ANY_TYPE, null);
				var haslinks = false;
				while (url = urls.iterateNext()) {
					var target = res.evaluate("./mb:target", url, nsr, XPathResult.ANY_TYPE, null);
					target = target.iterateNext();
					var begin, end;
					if (begin = res.evaluate("./mb:begin", url, nsr, XPathResult.ANY_TYPE, null).iterateNext()) {
						begin = begin.textContent;
					}
					if (end = res.evaluate("./mb:end", url, nsr, XPathResult.ANY_TYPE, null).iterateNext()) {
						end = end.textContent;
					} else if (res.evaluate("./mb:ended", url, nsr, XPathResult.ANY_TYPE, null).iterateNext()) {
						end = "????";
					}
					if (target) {
						if (addExternalLink({text: url.getAttribute("type"), target: target.textContent, mbid: target.getAttribute("id"), begin: begin, end: end})) {
							if (!haslinks) {
								haslinks = true;
								addExternalLink({text: " Hidden links"});
							}
						}
					}
				}
			} else if (this.status >= 400) {
				var txt = this.responseText.match(/<error><text>(.+)<\/text><text>/);
				txt = txt ? txt[1] : "";
				error(this.status, txt);
			}
		}
	};
	xhr.open("GET", entityUrlRelsWS, true);
	xhr.send(null);
}
function addSearchLinksSection(sectionPath, parentNode) {
	var level = sectionPath.length;
	var section = pathToItem(sectionPath);
	var sectionID = pathToID(sectionPath);
	var sectionTitle = getLocalizedText(section.title);
	var sectionTitleNode = createTag("h" + (1 + level), {a: {id: sectionID}}, sectionTitle);
	if (level === 1) {
		sectionTitleNode.classList.add(userjs + "searchLinks");
		var landingSibling = false;
		for (var n = 0; n < parentNode.children.length; n++)
			if (parentNode.children[n].classList.contains("editing")) {
				landingSibling = parentNode.children[n];
				break;
			}
		if (landingSibling) parentNode.insertBefore(sectionTitleNode, landingSibling);
		else parentNode.appendChild(sectionTitleNode);
		if (section === webSearchLinks) {
			sectionTitleNode.appendChild(document.createTextNode(" "));
			sectionTitleNode.appendChild(
					createTag("a", {a: {title: "filter search links"}, s: {padding: "1px 3px"}, e: {click: configureModule}},
						createTag("img", {a: {src: "/static/images/icons/filter.png", alt: "filter search links", title: "filter search links"}})
						));
		}
	} else parentNode.appendChild(sectionTitleNode);
	var sectionListNode = addAfter(createTag("ul", {a: {class: "external_links"}}), sectionTitleNode);
	if (level === 1) sectionListNode.classList.add(userjs + "searchLinks");
	if (section !== webSearchLinks) {
		var sectionCBox = sectionTitleNode.appendChild(
			createTag("input", {a: {type: "checkbox"}, s: {float: "right", margin: "1px"}, e: {click: function(event) {
				toggleStorage(this.parentNode.id);
				this.parentNode.nextElementSibling.classList.toggle("disabled", !this.checked);
				if (this.parentNode.parentNode.id !== "sidebar") {
					this.parentNode.parentNode.classList.toggle("disabled", !this.checked);
					toggleEmpty(this.parentNode.parentNode, !this.checked);
				} else {
					this.parentNode.classList.toggle("disabled", !this.checked);
				}
			}}}));
		sectionCBox.checked = !disabledSearchLinks[sectionID];
		if (disabledSearchLinks[sectionID]) {
			sectionListNode.classList.add("disabled");
			if (level === 1) sectionTitleNode.classList.add("disabled");
			else parentNode.classList.add("disabled");
		}
	}
	var hasNothing = true, hasVisibleContent = false;
	for (var itemKey in section.items) if (section.items.hasOwnProperty(itemKey)) {
		var item = section.items[itemKey];
		var itemPath = sectionPath.concat([itemKey]);
		var itemID = pathToID(itemPath);
		var itemNode = createTag("li", {a: {id: itemID}});
		if (item.items) {
			hasNothing = false;
			sectionListNode.appendChild(itemNode);
			var subIsVisible = addSearchLinksSection(itemPath, itemNode);
			if (subIsVisible) hasVisibleContent = true;
			else itemNode.classList.add("emptySection");
		} else {
			var itemTarget = false;
			if (Array.isArray(item.target)) {
				for (var t = 0; t < item.target.length; t++) {
					itemTarget = replaceAllTokens(getLocalizedText(item.target[t], item.multilingualKeys));
					if (itemTarget) break;
				}
			} else {
				itemTarget = replaceAllTokens(getLocalizedText(item.target, item.multilingualKeys));
			}
			if (itemTarget) {
				hasNothing = false;
				sectionListNode.appendChild(itemNode);
				var itemTitle = getLocalizedText(item.title);
				itemNode.appendChild(createTag("a", {a: {href: itemTarget}}, itemTitle));
				setFavicon(itemNode, itemTarget);
				var itemCBox = itemNode.appendChild(
						createTag("input", {a: {type: "checkbox"}, s: {float: "right", margin: "1px"}, e: {click: function(event) {
							this.parentNode.classList.toggle("disabled", !this.checked);
							toggleStorage(this.parentNode.id);
							toggleEmpty(this.parentNode, !this.checked);
						}}}));
				itemCBox.checked = !disabledSearchLinks[itemID];
				if (disabledSearchLinks[itemID]) itemNode.classList.add("disabled");
				else hasVisibleContent = true;
			}
		}
	}
	if (!hasVisibleContent) {
		if (level === 1 && section !== webSearchLinks) {
			sectionTitleNode.classList.add("emptySection");
			sectionListNode.classList.add("emptySection");
		}
		if (hasNothing) {
			var noItemNote = {
				de: "nichts für diesen Entitätstyp",
				en: "nothing for this entity type",
				fr: "rien pour ce type d'entité",
				nl: "niets voor dit soort entiteit",
			};
			sectionListNode.appendChild(createTag("li", {s: {fontStyle: "italic", opacity: "0.5"}}, getLocalizedText(noItemNote)));
		}
	}
	return hasVisibleContent && !disabledSearchLinks[sectionID];
}
function addUserLinks() {
	var loadedUserLinks = JSON.parse(localStorage.getItem(userjs + "user-autolinks")) || {};
	var filteredUserLinks = {};
	var currentSection = "", currentSectionIsEmpty = true;
	for (var title in loadedUserLinks) if (loadedUserLinks.hasOwnProperty(title)) {
		var target = loadedUserLinks[title];
		if (!target || target === "") {
			if (currentSectionIsEmpty) {
				delete filteredUserLinks[currentSection];
			}
			currentSection = title;
			currentSectionIsEmpty = true;
			filteredUserLinks[title] = null;
		}
		if (typeof target === "string") {
			target = replaceAllTokens(target);
			if (target) {
				currentSectionIsEmpty = false;
				filteredUserLinks[title] = target;
			}
		}
	}
	if (currentSectionIsEmpty) delete filteredUserLinks[currentSection];
	if (!Object.getOwnPropertyNames(filteredUserLinks).length) return;
	var userLinksTitle = {
		de: "Meine Links",
		en: "My links",
		fr: "Mes liens",
		nl: "Mijn links",
	};
	var userLinksTitleNode = createTag("h2", {}, getLocalizedText(userLinksTitle));
	userLinksTitleNode.appendChild(document.createTextNode(" "));
	userLinksTitleNode.appendChild(
			createTag("a", {a: {title: "configure user autolinks"}, s: {padding: "0px"}, e: {click: configureModule}},
				createTag("img", {a: {src: "/static/images/icons/cog.png", alt: "configure user autolinks", title: "configure user autolinks"}})
						));
	var landingSibling = false;
	for (var n = 0; n < sidebar.children.length; n++)
		if (sidebar.children[n].classList.contains("editing")) {
			landingSibling = sidebar.children[n];
			break;
		}
	if (landingSibling) sidebar.insertBefore(userLinksTitleNode, landingSibling);
	else parentNode.appendChild(userLinksTitleNode);
	var userLinksListNode = createTag("ul", {a: {class: "external_links " + userjs + "userLinks"}})
	addAfter(userLinksListNode, userLinksTitleNode);
	for (var title in filteredUserLinks) if (filteredUserLinks.hasOwnProperty(title)) {
		var target = filteredUserLinks[title];
		var itemNode = createTag("li", {});
		if (target === null) {
			itemNode.classList.add("subsectionHeader");
			itemNode.appendChild(document.createTextNode(title));
		  userLinksListNode.appendChild(document.createElement("hr"));
		} else {
			itemNode.appendChild(createTag("a", {a: {href: target}}, title));
			setFavicon(itemNode, target);
		}
		userLinksListNode.appendChild(itemNode);
	}
}
function getLocalizedText(textSet, multilingualKeys) {
	if (typeof textSet === "string") return textSet;
	if (multilingualKeys) {
		var expanded = {};
		for (var key in textSet) if (textSet.hasOwnProperty(key)) {
			var allKeys = key.split(" ");
			for (var ak = 0; ak < allKeys.length; ak++)
				expanded[allKeys[ak]] = textSet[key].replace(/%language%/g, allKeys[ak]);
		}
		textSet = expanded;
	}
	var languages = parseLanguages(rawLanguages);
	for (var l = 0; l < languages.length; l++) {
		if (textSet.hasOwnProperty(languages[l])) return textSet[languages[l]];
	}
	var fallbackLanguages = guessNavigatorLanguages().concat([document.documentElement.getAttribute("lang") || "en"]);
	for (var fl = 0; fl < fallbackLanguages.length; fl++) {
		if (textSet.hasOwnProperty(fallbackLanguages[fl])) return textSet[fallbackLanguages[fl]];
	}
	return textSet[Object.getOwnPropertyNames(textSet)[0]];
}
function idToPath(id) {
	return id.replace(userjs + "searchLinks-", "").split("-");
}
function loadDisabledSearchLinks() {
	var loadedSettings = JSON.parse(localStorage.getItem(userjs + "disabled-search-links")) || {};
	for (var itemID in loadedSettings) if (loadedSettings.hasOwnProperty(itemID)) {
		var itemPath = idToPath(itemID);
		if (itemPath && pathToItem(itemPath))
			disabledSearchLinks[itemID] = true;
	}
	delete disabledSearchLinks[pathToID(["web"])];
	localStorage.setItem(userjs + "disabled-search-links", JSON.stringify(disabledSearchLinks));
}
function pathToItem(path) {
	var item = searchLinks;
	for (var i = 0; i < path.length; i++) {
		item = item.items[path[i]];
		if (!item) return false;
	}
	return item;
}
function pathToID(path) {
	var id = userjs + "searchLinks";
	for (var i = 0; i < path.length; i++)
		id = id + "-" + path[i];
	return id;
}
function replaceAllTokens(string) {
	var stringTokens = string.match(/%[a-z]+(?:-[a-z]+)+%/g);
	if (stringTokens)	for (var t = 0; t < stringTokens.length; t++) {
		var token = stringTokens[t];
		if (!tokenValues.hasOwnProperty(token)) return false;
		string = string.replace(token, encodeURIComponent(tokenValues[token]));
	}
	return string;
}
function setFavicon(li, url) {
	var favclass = "no";
	// MusicBrainz cached favicon CSS classes
	var searchdomain = url.match(/site:([^+]*)\+/);
	var urldomain = searchdomain ? searchdomain[1] : url.split("/")[2];
	for (var classdomain in faviconClasses) if (faviconClasses.hasOwnProperty(classdomain)) {
		if (urldomain.match(classdomain)) {
			favclass = faviconClasses[classdomain];
			break;
		}
	}
	if (favclass != "no") {
		li.classList.add(favclass + "-favicon");
	} else {
		// Static favicon URL dictionary
		var favurlfound = false;
		for (var part in favicons) if (favicons.hasOwnProperty(part)) {
			if (url.indexOf(part) != -1) {
				favurlfound = favicons[part];
				break;
			}
		}
		if (!guessOtherFavicons && !favurlfound) {
			li.classList.add("no-favicon");
		} else {
			// arbitrary /favicon.ico load try out
			if (guessOtherFavicons && !favurlfound) {
				favurlfound = url.substr(0, url.indexOf("/", 8)) + "/favicon.ico";
			}
			var ifit = favicontry.length;
			favicontry[ifit] = new Image();
			favicontry[ifit].addEventListener("error", function (event) {
				this.li.classList.add("no-favicon");
			});
			favicontry[ifit].addEventListener("load", function (event) {
				clearTimeout(this.to);
				this.li.style.setProperty("background-image", "url(" + this.src + ")");
				this.li.style.setProperty("background-size", "16px 16px");
			});
			favicontry[ifit].li = li;
			favicontry[ifit].src = favurlfound;
			favicontry[ifit].to = setTimeout(function() {
				// don’t wait for more than 5 seconds
				favicontry[ifit].src = "";
				favicontry[ifit].li.classList.add("no-favicon");
			}, 5000);
		}
	}
}
function toggleEmpty(itemNode, hide) {
	if (!hide) {
		if (itemNode.parentNode.parentNode.id === "sidebar") {
			itemNode.parentNode.classList.remove("emptySection");
			itemNode.parentNode.previousElementSibling.classList.remove("emptySection");
		}
		else {
			itemNode.parentNode.parentNode.classList.remove("emptySection");
			toggleEmpty(itemNode.parentNode.parentNode, hide);
		}
	} else if (!itemNode.parentNode.classList.contains(pathToID(["web"]))) {
		var allDisabled = true;
		var siblings = itemNode.parentNode.children;
		for (var n = 0; n < siblings.length; n++) {
			if ((!siblings[n].classList.contains("disabled")) && (!siblings[n].classList.contains("emptySection"))) {
				allDisabled = false;
				break;
			}
		}
		if (allDisabled) {
			if (itemNode.parentNode.parentNode.id === "sidebar") {
				itemNode.parentNode.classList.add("emptySection");
				itemNode.parentNode.previousElementSibling.classList.add("emptySection");
			} else {
				itemNode.parentNode.parentNode.classList.add("emptySection");
				toggleEmpty(itemNode.parentNode.parentNode, hide);
			}
		}
	}
}
function toggleStorage(itemID) {
	var toggledSettings = JSON.parse(localStorage.getItem(userjs + "disabled-search-links")) || {};
	if (toggledSettings[itemID]) delete toggledSettings[itemID];
	else toggledSettings[itemID] = true;
	localStorage.setItem(userjs + "disabled-search-links", JSON.stringify(toggledSettings));
}
function weirdobg() {
	var weirdo = userjs + (new Date().getTime());
	try { open("", weirdo).blur(); } catch(error) {}
	self.focus();
	return weirdo;
}
function error(code, text) {
	var ldng = document.getElementById(userjs + "-loading");
	if (ldng) {
		ldng.setAttribute("id", userjs + "-error");
		ldng.style.setProperty("background", "pink");
		ldng.replaceChild(document.createTextNode("Error " + code), ldng.firstChild);
		ldng.appendChild(createTag("a", {a: {href: entityUrlRelsWS}}, "*"));
		ldng.appendChild(document.createTextNode(" in "));
		ldng.appendChild(createTag("a", {a: {href: "http://userscripts-mirror.org/scripts/show/108889"}}, "all links"));
		ldng.appendChild(document.createTextNode(" ("));
		ldng.appendChild(createTag("a", {e: {click: function(event) {
			var err = document.getElementById(userjs + "-error");
			if (err) { err.parentNode.removeChild(err); }
			addHiddenLinks();
		}}}, "retry"));
		ldng.appendChild(document.createTextNode(")"));
		ldng.appendChild(document.createElement("br"));
		ldng.appendChild(createTag("i", {}, text));
	} else {
		loading(true);
		error(code, text);
	}
}
function loading(on) {
	var ldng = document.getElementById(userjs + "-loading");
	if (on && !ldng) {
		extlinks.appendChild(createTag("li", {a: {id: userjs + "-loading"}}, createTag("img", {a: {alt: "loading all links…", src: "/static/images/icons/loading.gif"}})));
		var li = extlinks.querySelector("ul.external_links > li.all-relationships");
		if (li) {
			li.style.setProperty("display", "none");
		}
	} else if (ldng && !on) {
		ldng.parentNode.removeChild(ldng);
	}
}
function archivedDate(date, url) {
	var text = date == "????" ? "ended" : date.replace(/-/g, "‐");
	if (!url.match(/\.archive\.org\//)) {
		var archiveStamp = "*";
		if (date != "????") {
			archiveStamp = date.replace(/\D/g, "");
			while (archiveStamp.length < 14) archiveStamp += "0";
		}
		return createTag("a", {a: {href: "//wayback.archive.org/web/" + archiveStamp + "/" + url.replace(/https?:\/\//, ""), title: "Internet Archive Wayback Machine capture"}}, text);
	} else {
		return document.createTextNode(text);
	}
}
function nsr(prefix) {
	switch (prefix) {
		case "mb":
			return "http://musicbrainz.org/ns/mmd-2.0#";
		default:
			return null;
	}
}
function guessNavigatorLanguages() {
	if (Array.isArray(navigator.languages)) {
		return navigator.languages;
	} else {
		var language = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;
		if (language) {
			return [language];
		} else {
			return [];
		}
	}
}
function parseLanguages(inputLanguages) {
	var outputLanguages = [];
	for (var il = 0; il < inputLanguages.length; il++) {
		var nextLanguage = inputLanguages[il];
		if (inputLanguages[il] == "navigator") {
			var navigatorLanguages = guessNavigatorLanguages();
			for (var nl = 0; nl < navigatorLanguages.length; nl++) {
				nextLanguage = navigatorLanguages[nl];
				if (outputLanguages.indexOf(nextLanguage) < 0) {
					outputLanguages.push(nextLanguage);
				}
			}
		} else {
			if (inputLanguages[il] == "musicbrainz") {
				nextLanguage = document.documentElement.getAttribute("lang") || "en";
			}
			if (outputLanguages.indexOf(nextLanguage) < 0) {
				outputLanguages.push(nextLanguage);
			}
		}
	}
	return splitLanguages(outputLanguages);
}
function splitLanguages(inputLanguages) {
	var outputLanguages = [];
	for (var il = 0; il < inputLanguages.length; il++) {
		outputLanguages.push(inputLanguages[il]);
		if (inputLanguages[il].match(/-/)) {
			var splitLanguage = inputLanguages[il].split("-")[0];
			if (outputLanguages.indexOf(splitLanguage) < 0) {
				outputLanguages.push(splitLanguage);
			}
		}
	}
	return outputLanguages;
}
function configureModule(event) {
	switch (event.target.getAttribute("title")) {
		case "configure user autolinks":
			//TODO: provide a real editor
			var loadedUserAutolinks = localStorage.getItem(userjs + "user-autolinks") || {};
			var newUserAutolinks = prompt("Edit your user autolinks\r\nCopy/paste in a real editor\r\nSorry for such an awful prompt\r\n\r\nAvailable variables:\r\n- for all entity pages: %entity-type%, %entity-mbid% and %entity-name%\r\n- for \"foobar\" entity pages: %foobar-mbid% and %foobar-name% where \"foobar\" is an entity type.\r\n- for artist entity pages: %artist-sort-name%, %artist-family-name-first% and %artist-latin-script-name%\r\n- for url entity pages: %url-target% (while %entity-name% and %url-name% are deliberately ignored)\r\n\r\nExample: {\"Search for reviews\": \"//duckduckgo.com/?q=%entity-name%+reviews\",\r\n\"Search for fans\": \"//duckduckgo.com/?q=%artist-name%+fans\",\r\n\"Works\": \"/ws/2/artist/%artist-mbid%?inc=works\",\r\n\"La FNAC\": \"http://recherche.fnac.com/SearchResult/ResultList.aspx?SCat=3%211&Search=%release-name%&sft=1&sa=0\"}", loadedUserAutolinks);
			if (newUserAutolinks && newUserAutolinks != loadedUserAutolinks && JSON.stringify(newUserAutolinks)) {
				localStorage.setItem(userjs + "user-autolinks", newUserAutolinks);
			}
			break;
		case "configure default autolinks":
			//TODO: refresh default autolink statuses
			extlinks.classList.toggle("configure");
			break;
		case "filter search links":
			var topSectionNodes = sidebar.children;
			for (var n = 0; n < sidebar.children.length; n++)
				if (sidebar.children[n].classList.contains(userjs + "searchLinks"))
					sidebar.children[n].classList.toggle("configure");
			break;
		case "choose wikipedia languages":
			var navigatorLanguages = splitLanguages(guessNavigatorLanguages());
			var musicbrainzLanguage = splitLanguages([document.documentElement.getAttribute("lang") || "en"])[0];
			var loadedLanguages = localStorage.getItem(userjs + "languages") || JSON.stringify(rawLanguages);
			var newLanguages = prompt("Choose your favourite language(s)\r\n\r\nMeta languages are:\r\n- \"navigator\" for navigator settings, currently " + (navigatorLanguages.length > 0 ? "detected as " + JSON.stringify(navigatorLanguages).replace(/,/g, "$& ") : "undetected") + "\r\n- \"musicbrainz\" for MusicBrainz UI settings, currently " + (musicbrainzLanguage ? "detected as [" + JSON.stringify(musicbrainzLanguage) + "]" : "undetected") + "\r\n\r\nDefault: [\"navigator\", \"musicbrainz\"]\r\nExample 2: [\"fr\", \"en\", \"vi\", \"ja\"]\r\nExample 3: [\"en\"]\r\nExample 4: []", loadedLanguages.replace(/,/g, "$& "));
			if (newLanguages && newLanguages != loadedLanguages && JSON.stringify(newLanguages)) {
				localStorage.setItem(userjs + "languages", newLanguages);
				rawLanguages = newLanguages;
			}
			break;
	}
}
