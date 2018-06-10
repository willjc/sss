# -*- coding: utf-8 -*-
import scrapy


class GirlSpider(scrapy.Spider):
    name = 'girl'
    allowed_domains = ['so.com']
    start_urls = ['http://so.com/']

    def parse(self, response):
        pass
