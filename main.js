const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const axios = require('axios')
const fs = require('fs')
const {Telegraf} = require('telegraf')
let channel // -1001950929431
const DomParser = require('dom-parser');
const parser = new DomParser();
const bot = new Telegraf('5819320900:AAFsFJggzc8edphXHi7eAcWTSjssi8rZ6WU')
if (process.env.NODE_ENV !== 'production'){
  require('electron-reload')(__dirname, {

  })
}
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    title: "Twitter News",
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload.js"),
      sandbox: false,
    }
  });
mainWindow.loadFile("./views/index.html");
mainWindow.setMenuBarVisibility(false)
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on('sendMessage', async (e,data) =>{
    channel = data
    console.log(channel)
    const traders = require('./userids.json')
    let previousResponse = {};
    function checkForNewTraders(traders) {
        traders.forEach( async (trader,index) => {
            setTimeout(() => {
                let options = {
                    method: 'GET',
                    url: 'https://api.twitter.com/graphql/whN_WW_HT--6SW2bhDcx4Q/UserTweets',
                    params: {
                      variables: `{"userId":"${trader}","count":40,"includePromotedContent":true,"withQuickPromoteEligibilityTweetFields":true,"withSuperFollowsUserFields":true,"withDownvotePerspective":false,"withReactionsMetadata":false,"withReactionsPerspective":false,"withSuperFollowsTweetFields":true,"withVoice":true,"withV2Timeline":true}`,
                      features: '{"responsive_web_twitter_blue_verified_badge_is_enabled":true,"verified_phone_label_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true,"view_counts_public_visibility_enabled":true,"view_counts_everywhere_api_enabled":true,"tweetypie_unmention_optimization_enabled":true,"responsive_web_uc_gql_enabled":true,"vibe_api_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":false,"interactive_text_enabled":true,"responsive_web_text_conversations_enabled":false,"responsive_web_enhance_cards_enabled":true}'
                    },
                    headers: {
                      cookie: 'guest_id_marketing=v1%3A166700689154593211; guest_id_ads=v1%3A166700689154593211; personalization_id="v1_fenRmD36X+8Ar323KzkSWw=="; guest_id=v1%3A166700689154593211; kdt=kGSo2CQUM8UeBJioXQ6MW8aGyMyj5j1PPooA3CwZ; auth_token=d84c1ff8b17b3204e51766ae5783482274ce8a9c; ct0=ddbe04336416adacb27018ca53f0239a290891a8d7684817eab7b3f329defe6a969263601a2937e0c06d53bba8740bd0050fce0a73e17fc896fad91a04f12887d9609cd0683a2e6c60dc39a915587877; twid=u%3D1585730073050619905; des_opt_in=Y; _gcl_au=1.1.1735176641.1667006989; twtr_pixel_opt_in=Y; __ncuid=7a4e8bbb-95ad-42ae-a00d-037d944f14a1; _ga_ZJQNEMXF73=GS1.1.1667257521.1.1.1667257541.0.0.0; _ga_BYKEBDM7DS=GS1.1.1667496241.1.1.1667496251.0.0.0; mbox=PC#3a9e191bc4f24be28356000716c0090c.34_0#1734458328|session#8028c87cfe244fbea09a7ae33e29e642#1671215388; _ga=GA1.2.1071275730.1667006893; _ga_34PHSZMC42=GS1.1.1671217297.6.0.1671217297.0.0.0; lang=en; _gid=GA1.2.1768734110.1672972236',
                      authority: 'api.twitter.com',
                      accept: '*/*',
                      'accept-language': 'es-ES,es;q=0.9,en;q=0.8',
                      authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
                      'content-type': 'application/json',
                      origin: 'https://twitter.com',
                      referer: 'https://twitter.com/',
                      'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
                      'sec-ch-ua-mobile': '?0',
                      'sec-ch-ua-platform': '"Windows"',
                      'sec-fetch-dest': 'empty',
                      'sec-fetch-mode': 'cors',
                      'sec-fetch-site': 'same-site',
                      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                      'x-csrf-token': 'ddbe04336416adacb27018ca53f0239a290891a8d7684817eab7b3f329defe6a969263601a2937e0c06d53bba8740bd0050fce0a73e17fc896fad91a04f12887d9609cd0683a2e6c60dc39a915587877',
                      'x-twitter-active-user': 'yes',
                      'x-twitter-auth-type': 'OAuth2Session',
                      'x-twitter-client-language': 'en'
                    }
                  }
              axios.request(options).then(async function (response) {
                await response.data
                let currentResponse
                let username
                const entries = response?.data?.data?.user?.result?.timeline_v2?.timeline?.instructions[1]?.entries;
                if (entries) {
                  let content = entries[0]?.content;
                  let items = content?.items;
                  if (items) {
                    let itemContent = items[0]?.item?.itemContent;
                    let tweetResults = itemContent?.tweet_results?.result;
                    let fullText = tweetResults?.tweet?.legacy?.full_text;
                    if (fullText) {
                      console.log(`${trader}: ${fullText}`);
                      currentResponse = fullText
                      username = response.data.data.user.result.timeline_v2.timeline.instructions[1].entries[0].content.items[0].item.itemContent.tweet_results.result.tweet.core.user_results.result.legacy.name
                    }
                  } else {
                    let itemContent = content?.itemContent
                    if (itemContent){
                      let tweetResults = itemContent?.tweet_results?.result
                      let fullText = tweetResults?.legacy?.full_text
                      if (fullText){
                        console.log(`${trader}: ${fullText}`)
                        currentResponse = fullText
                        username = response.data.data.user.result.timeline_v2.timeline.instructions[1].entries[0].content.itemContent.tweet_results.result.core.user_results.result.legacy.name
                      }
                    }
                  }
                } 
                if (currentResponse && JSON.stringify(previousResponse[trader]) !== JSON.stringify(currentResponse)) {
                  previousResponse[trader] = currentResponse;
                    if (currentResponse.slice(0, 4) !== 'RT @'){
                      let datos = encodeURIComponent(currentResponse)
                      let params = `async=translate,sl:auto,tl:es,st:${datos},id:1678936359745,qc:true,ac:true,_id:tw-async-translate,_pms:s,_fmt:pc`
                        let options = {
                            method: 'POST',
                            url: 'https://www.google.com/async/translate',
                            params: {
                                vet: '12ahUKEwj7zMq5tt_9AhUSl2oFHdIYAXcQqDh6BAgFECk..i',
                                ei: '8IESZPuUCZKuqtsP0rGEuAc',
                                rlz: '1C1CHBD_esVE1043VE1043',
                                yv: '3',
                                cs: '1'
                            },
                            headers: {
                                cookie: 'SEARCH_SAMESITE=CgQI25cB; __Secure-ENID=10.SE=Wry20jMaOkwIsB6E2Ix4YIh097b1ztM_AKJTRI8WKiaiYCdLckFr_jb1oeyz_kU4WMgUWfHRownFytzzqmmhkccC58kkIIBCczMnOyugzo1C6gqIMKEv_68sh6y2AtRxgEVvbBUsKZ82JNwn7DVs3h4PFlctBRz4jrEvFRG7A7UFJuXsIDvlKCqzVXKYj5s64L9ia-u_85bz_-_L9zAHxfenYdNo-v-b2Rk2bFFKr7p_GgJkGQLOFhkYFKkxBG4IRKo; OTZ=6931722_72_74__74_; SID=UQgNb30NWliReuCRk0jWefI32f-T1Icg8h2oBnVbo4yyUM0hKsQxpBsxHXw32m_7aHfKrA.; __Secure-1PSID=UQgNb30NWliReuCRk0jWefI32f-T1Icg8h2oBnVbo4yyUM0h8EVIGtJ8IpNbrzjqELJg8A.; __Secure-3PSID=UQgNb30NWliReuCRk0jWefI32f-T1Icg8h2oBnVbo4yyUM0hp3MCrhUfUyrjsFvGG8aC-Q.; HSID=A3udkmi1fZW8SRNwx; SSID=ADV1_CMUyKhAwwdoO; APISID=NDCt-YGsSUY5djis/ANChNakoheO28fECf; SAPISID=EDwaIAATncJSB-3S/AOSES1KnQqb4XTUEy; __Secure-1PAPISID=EDwaIAATncJSB-3S/AOSES1KnQqb4XTUEy; __Secure-3PAPISID=EDwaIAATncJSB-3S/AOSES1KnQqb4XTUEy; AEC=ARSKqsJTfsSTGYBbXnWb71H_gtaP_aHfzZp_Y0yfp5shKQ2zVQpBqFpDtg; NID=511=OkxmR5ljgaQF4V0SveS_Mgdl_-mKYgnHPMZkwAPLWrQCyurAb2AWUekohSjTCWdJUJ1qCnW-za6flPuLdOpSpr-VFk0WlZ9tNL4FcyN87tfqb6MEXhTejVZjkfBdtZHYvYzU3SoP4WwUQFl60xo2txDIkX0fr7TjmHi62PE0klU7u9RICGl22Rtjf_rCvWTm2wLpVpPU6WPu7RUjnzyUTb98mHIZvTX9u69qI1QGZambV3XkMJFEI0EJBszW_2MuqUculeK3yYZ7CVXIKdojfpBqxgxlqg9grXdzdyidX0yULbze9sTL6i41RD_bJBUjNw; 1P_JAR=2023-03-16-03; DV=o1klMYWo6_VTcFlM3f0m-VzGdaB-bhhEH2Srbk0ZxAAAAPCb-EUNtqYowgAAAOTjO4MPwxPGMgAAAP9ZBdYJRURoDgAAAA; SIDCC=AFvIBn8tSTvhOiCuyXob6bhyVH5XtGOavJ_MVtprrJC1e8Z_Zkyrf2pyvKX4JoeDfEhYv86vJEQ; __Secure-1PSIDCC=AFvIBn82Wu7eSMUoSKn7kilyiN_yeyyCKTJdh6moOkClVJplRD8wRPNwLecGoBYg-PJT5NWFdH6a; __Secure-3PSIDCC=AFvIBn9SnYk8O9EEIvET5hrMkv_BAsoFdL44ho_VHkWIduSH6EkYRpLP2FOmqgpgiHO4QMvE4ptH',
                                authority: 'www.google.com',
                                accept: '*/*',
                                'accept-language': 'es-ES,es;q=0.9',
                                origin: 'https://www.google.com',
                                referer: 'https://www.google.com/',
                                'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
                                'sec-ch-ua-arch': '"x86""',
                                'sec-ch-ua-bitness': '"64"',
                                'sec-ch-ua-full-version': '"110.0.5481.180"',
                                'sec-ch-ua-full-version-list': '"Chromium";v="110.0.5481.180", "Not A(Brand";v="24.0.0.0", "Google Chrome";v="110.0.5481.180"',
                                'sec-ch-ua-mobile': '?0',
                                'sec-ch-ua-platform': '"Windows"',
                                'sec-ch-ua-platform-version': '"15.0.0"',
                                'sec-ch-ua-wow64': '?0',
                                'sec-fetch-dest': 'empty',
                                'sec-fetch-mode': 'cors',
                                'sec-fetch-site': 'same-origin',
                                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                                'x-client-data': 'CIy2yQEIorbJAQjBtskBCKmdygEIt+LKAQiTocsBCIP2zAEImv7MAQiRjM0BCKaMzQEIj5bNAQinls0BCOGXzQEI5JfNAQjMmM0BCLiZzQEI9JnNAQi1ms0BCNLhrAIIoIStAg==',
                                'content-length': `${params.length}`,
                                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                                'accept-encoding': 'gzip, deflate, br'
                            },
                            data: params
                        };
                      axios.request(options).then(async response =>{
                        await response.data
                        let datas = response.data
                        let sliced = datas.slice(50)
                        let slice2 = sliced.slice(0, -7)
                        let parsedHTML = parser.parseFromString(slice2)
                        if(parsedHTML.getElementById('tw-answ-target-text').innerHTML !== undefined){
                            bot.telegram.sendMessage(channel, `<b>Enviado por: ${username}</b>\n\n${parsedHTML.getElementById('tw-answ-target-text').innerHTML}`, {parse_mode: "HTML"})
                        }
                      }).catch(error => console.error(error))
                        } else if (currentResponse.slice(0, 4) == 'RT @'){
                            let rtData = response.data.data.user.result.timeline_v2.timeline.instructions[1].entries[0].content.itemContent.tweet_results.result.legacy.retweeted_status_result.result.legacy.full_text
                            let datos = encodeURIComponent(rtData)
                            let params = `async=translate,sl:auto,tl:es,st:${datos},id:1678936359745,qc:true,ac:true,_id:tw-async-translate,_pms:s,_fmt:pc`
                            let options = {
                                method: 'POST',
                                url: 'https://www.google.com/async/translate',
                                params: {
                                  vet: '12ahUKEwj7zMq5tt_9AhUSl2oFHdIYAXcQqDh6BAgFECk..i',
                                  ei: '8IESZPuUCZKuqtsP0rGEuAc',
                                  rlz: '1C1CHBD_esVE1043VE1043',
                                  yv: '3',
                                  cs: '1'
                                },
                                headers: {
                                  cookie: 'SEARCH_SAMESITE=CgQI25cB; __Secure-ENID=10.SE=Wry20jMaOkwIsB6E2Ix4YIh097b1ztM_AKJTRI8WKiaiYCdLckFr_jb1oeyz_kU4WMgUWfHRownFytzzqmmhkccC58kkIIBCczMnOyugzo1C6gqIMKEv_68sh6y2AtRxgEVvbBUsKZ82JNwn7DVs3h4PFlctBRz4jrEvFRG7A7UFJuXsIDvlKCqzVXKYj5s64L9ia-u_85bz_-_L9zAHxfenYdNo-v-b2Rk2bFFKr7p_GgJkGQLOFhkYFKkxBG4IRKo; OTZ=6931722_72_74__74_; SID=UQgNb30NWliReuCRk0jWefI32f-T1Icg8h2oBnVbo4yyUM0hKsQxpBsxHXw32m_7aHfKrA.; __Secure-1PSID=UQgNb30NWliReuCRk0jWefI32f-T1Icg8h2oBnVbo4yyUM0h8EVIGtJ8IpNbrzjqELJg8A.; __Secure-3PSID=UQgNb30NWliReuCRk0jWefI32f-T1Icg8h2oBnVbo4yyUM0hp3MCrhUfUyrjsFvGG8aC-Q.; HSID=A3udkmi1fZW8SRNwx; SSID=ADV1_CMUyKhAwwdoO; APISID=NDCt-YGsSUY5djis/ANChNakoheO28fECf; SAPISID=EDwaIAATncJSB-3S/AOSES1KnQqb4XTUEy; __Secure-1PAPISID=EDwaIAATncJSB-3S/AOSES1KnQqb4XTUEy; __Secure-3PAPISID=EDwaIAATncJSB-3S/AOSES1KnQqb4XTUEy; AEC=ARSKqsJTfsSTGYBbXnWb71H_gtaP_aHfzZp_Y0yfp5shKQ2zVQpBqFpDtg; NID=511=OkxmR5ljgaQF4V0SveS_Mgdl_-mKYgnHPMZkwAPLWrQCyurAb2AWUekohSjTCWdJUJ1qCnW-za6flPuLdOpSpr-VFk0WlZ9tNL4FcyN87tfqb6MEXhTejVZjkfBdtZHYvYzU3SoP4WwUQFl60xo2txDIkX0fr7TjmHi62PE0klU7u9RICGl22Rtjf_rCvWTm2wLpVpPU6WPu7RUjnzyUTb98mHIZvTX9u69qI1QGZambV3XkMJFEI0EJBszW_2MuqUculeK3yYZ7CVXIKdojfpBqxgxlqg9grXdzdyidX0yULbze9sTL6i41RD_bJBUjNw; 1P_JAR=2023-03-16-03; DV=o1klMYWo6_VTcFlM3f0m-VzGdaB-bhhEH2Srbk0ZxAAAAPCb-EUNtqYowgAAAOTjO4MPwxPGMgAAAP9ZBdYJRURoDgAAAA; SIDCC=AFvIBn8tSTvhOiCuyXob6bhyVH5XtGOavJ_MVtprrJC1e8Z_Zkyrf2pyvKX4JoeDfEhYv86vJEQ; __Secure-1PSIDCC=AFvIBn82Wu7eSMUoSKn7kilyiN_yeyyCKTJdh6moOkClVJplRD8wRPNwLecGoBYg-PJT5NWFdH6a; __Secure-3PSIDCC=AFvIBn9SnYk8O9EEIvET5hrMkv_BAsoFdL44ho_VHkWIduSH6EkYRpLP2FOmqgpgiHO4QMvE4ptH',
                                  authority: 'www.google.com',
                                  accept: '*/*',
                                  'accept-language': 'es-ES,es;q=0.9',
                                  origin: 'https://www.google.com',
                                  referer: 'https://www.google.com/',
                                  'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
                                  'sec-ch-ua-arch': '"x86""',
                                  'sec-ch-ua-bitness': '"64"',
                                  'sec-ch-ua-full-version': '"110.0.5481.180"',
                                  'sec-ch-ua-full-version-list': '"Chromium";v="110.0.5481.180", "Not A(Brand";v="24.0.0.0", "Google Chrome";v="110.0.5481.180"',
                                  'sec-ch-ua-mobile': '?0',
                                  'sec-ch-ua-platform': '"Windows"',
                                  'sec-ch-ua-platform-version': '"15.0.0"',
                                  'sec-ch-ua-wow64': '?0',
                                  'sec-fetch-dest': 'empty',
                                  'sec-fetch-mode': 'cors',
                                  'sec-fetch-site': 'same-origin',
                                  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
                                  'x-client-data': 'CIy2yQEIorbJAQjBtskBCKmdygEIt+LKAQiTocsBCIP2zAEImv7MAQiRjM0BCKaMzQEIj5bNAQinls0BCOGXzQEI5JfNAQjMmM0BCLiZzQEI9JnNAQi1ms0BCNLhrAIIoIStAg==',
                                  'content-length': `${params.length}`,
                                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                                  'accept-encoding': 'gzip, deflate, br'
                                },
                                data: params
                            };
                                axios.request(options).then( async response =>{
                                  await response.data
                                  let datas = response.data
                                  let sliced = datas.slice(50)
                                  let slice2 = sliced.slice(0, -7)
                                  let parsedHTML = parser.parseFromString(slice2)
                                  if(parsedHTML.getElementById('tw-answ-target-text').innerHTML !== undefined){
                                      bot.telegram.sendMessage(channel, `<b>Retweeteado por: ${username}</b>\n\n${parsedHTML.getElementById('tw-answ-target-text').innerHTML}`, {parse_mode: "HTML"})
                                  }
                                }).catch(error => console.error(error))
                            }
                }
              }).catch(function (error) {
                console.error(error);
              });
            }, index * 2000);
        })
      }
      
      setInterval(() => checkForNewTraders(traders), 120000);
      checkForNewTraders(traders)
})


ipcMain.on('username', (e, data) =>{
    if (extractUsername(data) == null || data == undefined){
        mainWindow.webContents.send('prop', '')
    } else{
        addDataToArray(data, 'username.json')
        let username = extractUsername(data)
        var options = {
            method: 'GET',
            url: 'https://api.twitter.com/graphql/nZjSkpOpSL5rWyIVdsKeLA/UserByScreenName',
            params: {
              variables: `{"screen_name":"${username}","withSafetyModeUserFields":true}`,
              features: '{"responsive_web_twitter_blue_verified_badge_is_enabled":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true}'
            },
            headers: {
              authority: 'api.twitter.com',
              accept: '*/*',
              'accept-language': 'es-ES,es;q=0.9',
              authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
              'content-type': 'application/json',
              cookie: '_ga=GA1.2.226714363.1676317550; guest_id=v1%3A167781951274224270; guest_id_ads=v1%3A167781951274224270; guest_id_marketing=v1%3A167781951274224270; kdt=UkBRP9qq3errjT4N5QCSW1QB37X4U8zWNuzU86Wx; auth_token=6667b71e37fdf14d84d66259201b619b9ba89672; ct0=c48135827a75ce6f2286796a8420b594c93a4c678e4147478489a1076d592ea8d04961a022261c0b19ebe4331ba5d10cb5bf8dff02321bdda6d5401dac311103dfe59bd44bc43a94107603bf902a6b37; twid=u%3D1585730073050619905; _gid=GA1.2.2064925168.1678917556; external_referer=padhuUp37zhhiSfUH0crRlPcX6xAiSe8dWONk3AWkIg%3D|0|8e8t2xd8A2w%3D; personalization_id=v1_OVABMi8nvioV49wYEZ17rg==',
              origin: 'https://twitter.com',
              referer: 'https://twitter.com/',
              'sec-ch-ua': 'Chromium;v=110, Not',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': 'Windows',
              'sec-fetch-dest': 'empty',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'same-site',
              'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
              'x-csrf-token': 'c48135827a75ce6f2286796a8420b594c93a4c678e4147478489a1076d592ea8d04961a022261c0b19ebe4331ba5d10cb5bf8dff02321bdda6d5401dac311103dfe59bd44bc43a94107603bf902a6b37',
              'x-twitter-active-user': 'yes',
              'x-twitter-auth-type': 'OAuth2Session',
              'x-twitter-client-language': 'en'
            }
          };
          
          axios.request(options).then(function (response) {
            let id = response.data.data.user.result.rest_id
            addDataToArray(id, 'userids.json')
            mainWindow.webContents.send('usernameList', '')
          }).catch(function (error) {
            console.error(error);
          });
    }
})

ipcMain.on("deleteUsername", (e,data) =>{
    deleteValueFromFile('username.json', data)
    let username = extractUsername(data)
    var options = {
      method: 'GET',
      url: 'https://api.twitter.com/graphql/nZjSkpOpSL5rWyIVdsKeLA/UserByScreenName',
      params: {
        variables: `{"screen_name":"${username}","withSafetyModeUserFields":true}`,
        features: '{"responsive_web_twitter_blue_verified_badge_is_enabled":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true}'
      },
      headers: {
        authority: 'api.twitter.com',
        accept: '*/*',
        'accept-language': 'es-ES,es;q=0.9',
        authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
        'content-type': 'application/json',
        cookie: '_ga=GA1.2.226714363.1676317550; guest_id=v1%3A167781951274224270; guest_id_ads=v1%3A167781951274224270; guest_id_marketing=v1%3A167781951274224270; kdt=UkBRP9qq3errjT4N5QCSW1QB37X4U8zWNuzU86Wx; auth_token=6667b71e37fdf14d84d66259201b619b9ba89672; ct0=c48135827a75ce6f2286796a8420b594c93a4c678e4147478489a1076d592ea8d04961a022261c0b19ebe4331ba5d10cb5bf8dff02321bdda6d5401dac311103dfe59bd44bc43a94107603bf902a6b37; twid=u%3D1585730073050619905; _gid=GA1.2.2064925168.1678917556; external_referer=padhuUp37zhhiSfUH0crRlPcX6xAiSe8dWONk3AWkIg%3D|0|8e8t2xd8A2w%3D; personalization_id=v1_OVABMi8nvioV49wYEZ17rg==',
        origin: 'https://twitter.com',
        referer: 'https://twitter.com/',
        'sec-ch-ua': 'Chromium;v=110, Not',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': 'Windows',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'x-csrf-token': 'c48135827a75ce6f2286796a8420b594c93a4c678e4147478489a1076d592ea8d04961a022261c0b19ebe4331ba5d10cb5bf8dff02321bdda6d5401dac311103dfe59bd44bc43a94107603bf902a6b37',
        'x-twitter-active-user': 'yes',
        'x-twitter-auth-type': 'OAuth2Session',
        'x-twitter-client-language': 'en'
      }
    };
    
    axios.request(options).then(function (response) {
        let id = response.data.data.user.result.rest_id
        deleteValueFromFile('userids.json',id)
        mainWindow.webContents.send('usernameList', '')
    }).catch(function (error) {
      console.error(error);
    });
})

function extractUsername(str) {
    const regex = /@(\w+)/;
    const match = regex.exec(str);
    if (match) {
      return match[1];
    } else {
      return null;
    }
}
function addDataToArray(data, filename) {
    // Read the existing data from the file, or create an empty array if the file doesn't exist
    let dataArray = [];
    if (fs.existsSync(filename)) {
      const existingData = fs.readFileSync(filename, 'utf-8');
      dataArray = JSON.parse(existingData);
    }
  
    // Add the new data to the array
    dataArray.push(data);
  
    // Write the updated array back to the file
    fs.writeFileSync(filename, JSON.stringify(dataArray));
  
    console.log('Data added to array and saved to file:', data);
}

function deleteValueFromFile(filename, valueToDelete, key = null) {
    // Read the JSON file
    const data = JSON.parse(fs.readFileSync(filename));
  
    // If there's a key, find the index of the value to delete
    let index;
    if (key !== null) {
      index = data[key].indexOf(valueToDelete);
      if (index === -1) {
        console.log(`Value '${valueToDelete}' not found in '${key}' array.`);
        return;
      }
    } else {
      index = data.indexOf(valueToDelete);
      if (index === -1) {
        console.log(`Value '${valueToDelete}' not found in array.`);
        return;
      }
    }
  
    // Remove the value from the array
    if (key !== null) {
      data[key].splice(index, 1);
    } else {
      data.splice(index, 1);
    }
  
    // Write the updated data to the file
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`Value '${valueToDelete}' deleted from file '${filename}'.`);
  }
bot.launch()