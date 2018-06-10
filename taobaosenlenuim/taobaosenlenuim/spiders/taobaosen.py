# -*- coding: utf-8 -*-
import scrapy
from scrapy import Request
from urllib.parse import quote
from ..items import TaobaosenlenuimItem
from prettyprinter import pprint

class TaobaosenSpider(scrapy.Spider):
    name = 'taobaosen'
   # allowed_domains = ['www.taobao.com']

    def start_requests(self):
        baseurl='https://s.taobao.com/search?q='
        # keyword=self.settings.get('KEYWORD')
        for keyword in self.settings.get('KEYWORD'):
            for page in range(1,self.settings.get('MAXPAGE')+1):
                url=baseurl+quote(keyword)
                yield Request(url,callback=self.parse,meta={"page":page},dont_filter=True)


    def parse(self, response):

        products=response.xpath('//div[@id="mainsrp-itemlist"]//div[@class="items"][1]//div[contains(@class,"item")]')

        for product in products:
            item=TaobaosenlenuimItem()
            item['title']=''.join(product.xpath('//div[contains(@class,"title")]//text()').extract()).strip()
            yield item

