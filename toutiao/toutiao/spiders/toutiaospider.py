# -*- coding: utf-8 -*-
import scrapy
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.common.by import By
from urllib.parse import quote
from urllib.parse import urlencode
import requests
import json
from scrapy.loader import ItemLoader
from prettyprinter import pprint
from ..items import ToutiaoItem
class ToutiaospiderSpider(scrapy.Spider):
    name = 'toutiaospider'
    #allowed_domains = ['toutiao.com']
    baseurl='https://www.toutiao.com/c/user/followed/?'
    ###第一个开始采集的自媒体号粉丝列表
    firsturl='https://www.toutiao.com/c/user/relation/97300292946/?tab=followed'
    firsturluserid='97300292946';

    #start_urls = ['http://toutiao.com/']
    def start_requests(self):
        # bro=self.openselenium(self.firsturl)
        # sign=bro.execute_script('return TAC.sign(' + str(self.firsturluserid) + str(0) + ')')
        # cookievalue=bro.get_cookies()
        brower=self.openselenium(self.firsturl)
        sign, cookievalue=self.openseleniumsign(brower,self.firsturluserid)
        #sign,cookievalue=self.getfanssignure(self.firsturl,self.firsturluserid)
        canshu={"user_id":self.firsturluserid,"cursor":0,"count":20,"_signature":sign}
        url=self.baseurl+urlencode(canshu)
        yield scrapy.Request(url,cookies=cookievalue,meta={'brower':brower},callback=self.parse)

    def get_signure(self,url,userinfoid,maxtime=0):
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        brower=webdriver.Chrome(chrome_options=chrome_options)
        brower.get(url)
        '''
        TAC.sign(userInfo.id + "" + c.params.max_behot_time)
        '''
        ascp = brower.execute_script('return ascp.getHoney()')#执行js
        sign=brower.execute_script('return TAC.sign('+str(userinfoid)+str(maxtime)+')')
        return ascp,sign
    def getfanssignure(self,url,userinfoid,cursor=0):
        # chrome_options = Options()
        # chrome_options.add_argument('--headless')
        options=webdriver.FirefoxOptions()
        options.set_headless()
        options.add_argument('--disable-gpu')
        brower = webdriver.Firefox(firefox_options=options)

        brower.get(url)
        cookievalue=brower.get_cookies()
        #print(cookievalue)
        sign = brower.execute_script('return TAC.sign(' + str(userinfoid) + str(cursor) + ')')
        brower.close()
        print('return TAC.sign(' + str(userinfoid) + str(cursor) + ')')
        return sign,cookievalue
    def openselenium(self,url):
        # options = webdriver.FirefoxOptions()
        # options.set_headless()
        # options.add_argument('--disable-gpu')
        #brower = webdriver.Firefox(firefox_options=options)
        brower = webdriver.Firefox()
        brower.get(url)
        return brower
    def openseleniumsign(self,brower,userinfoid,cursor=0):
        sign=brower.execute_script('return TAC.sign(' + str(userinfoid) + str(cursor) + ')')
        cookievalue=brower.get_cookies()
        return sign,cookievalue
    def closeselenium(self,brower):
        brower.close()
        return None
    def parse(self, response):
        # pprint(type(response.text))

        dictres=json.loads(response.text)
        #pprint(dictres)
        datas=dictres.get('data')
        for data in datas:
            pprint(data.get('open_url'))
            item1 = ItemLoader(item=ToutiaoItem(), response=response)
            item1.add_value('open_url',data.get('open_url'))
            item1.add_value('user_id',data.get('user_id'))
            item1.add_value('description',data.get('description'))
            item1.add_value('bg_img_url',data.get('bg_img_url'))
            item1.add_value('user_verified',data.get('user_verified'))
            item1.add_value('verified_content',data.get('verified_content'))
            item1.add_value('avatar_url',data.get('avatar_url'))
            item1.add_value('cf_info',data.get('cf_info'))
            item1.add_value('verified_agency',data.get('verified_agency'))
            item1.add_value('media_id',data.get('media_id'))
            item1.add_value('cf_count', data.get('cf_count'))
            item1.add_value('is_pgc', data.get('is_pgc'))
            item1.add_value('relation_status', data.get('relation_status'))
            item1.add_value('name', data.get('name'))
            yield item1.load_item()

        has_more = dictres.get('has_more')
        brower=response.meta.get('brower')
        # pprint(response.request.headers.getlist('Cookie'))
        # pprint(response.headers.getlist('Set-Cookie'))

        if has_more:
            pprint('正在爬取下一页')
            nextcookie=response.headers.getlist('Set-Cookie')
            pprint(nextcookie)
            cursor = dictres.get('cursor')  # 获取到了游标,signature是可以通过userinfoid和cursor计算出来的
            nexesign=brower.execute_script('return TAC.sign(' + str(self.firsturluserid) + str(cursor) + ')')
            #nextcookie=brower.get_cookies()
            canshu = {"user_id": str(self.firsturluserid), "cursor": str(cursor), "count": str(20), "_signature": str(nexesign)}
            url = self.baseurl + str(urlencode(canshu))

            pprint(url)
            yield scrapy.Request(url,headers={'referer':self.firsturl},meta={'brower': brower}, callback=self.parse)
        else:
            nextcookie = response.request.headers.getlist('Cookie')
            pprint(nextcookie)
            self.closeselenium(brower)
            pprint('没有下一页了')

        #pprint(dictres.get('data'))
