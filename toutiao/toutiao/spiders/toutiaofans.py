# -*- coding: utf-8 -*-
import scrapy
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from urllib.parse import quote
from urllib.parse import urlencode
import json
class ToutiaospiderSpider(scrapy.Spider):
    name = 'toutiaofans'
    #allowed_domains = ['toutiao.com']
    baseurl='https://www.toutiao.com/c/user/followed/?'
    #starturl='https://www.toutiao.com/c/user/relation/4644596221/?tab=followed'
    ceshiurl='https://www.toutiao.com/c/user/55301399445/'
    userinfoid='55301399445'
    ###第一个开始采集的自媒体号粉丝列表
    firsturl='https://www.toutiao.com/c/user/relation/55301399445/?tab=followed'
    firsturluserid='55301399445';
    def start_requests(self):
        metas={'userinfoid':self.userinfoid,'cursor':0,'baseurl':self.baseurl}

        yield scrapy.Request(self.firsturl,meta=metas,callback=self.parse)


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
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        brower = webdriver.Chrome(chrome_options=chrome_options)
        brower.get(url)
        cookievalue=brower.get_cookies()
        sign = brower.execute_script('return TAC.sign(' + str(userinfoid) + str(cursor) + ')')
        return sign,cookievalue
    def parse(self, response):
        dictres=json.loads(response.text)
        print(response.text)
