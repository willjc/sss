# -*- coding: utf-8 -*-
import scrapy

class HttpbinSpider(scrapy.Spider):
    name = 'httpbin'
    #allowed_domains = ['httpbin.org']
    #start_urls = ['http://httpbin.org/get']
    star_post_url='http://httpbin.org/post'

    def start_requests(self):
        yield scrapy.FormRequest(self.star_post_url,formdata={"title":"hellworld"},callback=self.parse)

    def parse(self, response):

        print(response.text)
