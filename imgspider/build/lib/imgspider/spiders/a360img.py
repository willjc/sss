# -*- coding: utf-8 -*-
import scrapy
from urllib.parse import urlencode
from prettyprinter import pprint
import json
from ..items import ImgspiderItem

class A360imgSpider(scrapy.Spider):
    name = 'img360'
    #allowed_domains = ['360.com']
    start_urls = ['http://image.so.com/z?ch=beauty']
    baseurl='http://image.so.com/zj?'
    def start_requests(self):
        data={"ch":"beauty","listtype":"new"}
        for page in range(1,self.settings.get('MAX_PAGE')+1):
            data['sn']=page*30
            url=self.baseurl+urlencode(data)
            yield scrapy.Request(url,callback=self.parse)
    def parse(self, response):

        result=json.loads(response.text)


        for listabc in result.get('list'):
            itemd = ImgspiderItem()
            itemd['id']=listabc['imageid']
            itemd['url']=listabc['qhimg_url']
            itemd['title']=listabc['group_title']
            itemd['thumb']=listabc['qhimg_thumb_url']
            yield itemd


