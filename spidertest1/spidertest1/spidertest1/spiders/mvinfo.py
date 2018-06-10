# -*- coding: utf-8 -*-
import scrapy
import re
from scrapy import Request
from ..items import Spidertest1Item
from scrapy.loader import ItemLoader

class ExampleSpider(scrapy.Spider):
    name = 'mvinfo'
    #allowed_domains = ['example.com']
    start_urls = ['https://movie.douban.com/top250']

    def parse(self, response):
        baseurl=self.start_urls[0]
        print(baseurl)
        lista= response.xpath('//div[@class="hd"]/a/@href').extract()
        for list in lista:
            #yield Request(list,callback=self.detailitemloader)
            yield Request(list,callback=self.detailitemloader)



        nextpageuri=response.xpath('//span [@class="next"]/a/@href').extract()
        if nextpageuri:
            nextpage=baseurl+nextpageuri[0]
            yield Request(nextpage,callback=self.parse)

    def zhengze(self,pattern,responsetext):
        machdata=re.search(pattern, responsetext, re.S)
        #若没有匹配到会返回为None
        if machdata:
            return machdata.group(1)
        else:
            return ""
    def detailitemloader(self,response):
        iteml=ItemLoader(item=Spidertest1Item(),response=response)
        iteml.add_xpath('filmname','//span[@property="v:itemreviewed"]/text()')
        iteml.add_xpath('filmyear','//span[@class="year"]/text()')
        iteml.add_xpath('director','//a[@rel="v:directedBy"]/text()')
        iteml.add_xpath('actors','//a[@rel="v:starring"]/text()')
        iteml.add_xpath('typea','//span[@property="v:genre"]/text()')
        iteml.add_xpath('property','//span[@property="v:initialReleaseDate"]/text()')
        iteml.add_xpath('pianchang','//span[@property="v:runtime"]/text()')
        pattern = '制片国家/地区:</span>(.*?)<br/>'

        countrygroup = self.zhengze(pattern, response.text)
        iteml.add_value('country',countrygroup)
        return iteml.load_item()

    def detail(self,response):
        items=Spidertest1Item()
        #filmname
        filmname=response.xpath('//span[@property="v:itemreviewed"]/text()').extract()[0]
        items['filmname']=filmname
        filmyear=response.xpath('//span[@class="year"]/text()').extract()[0]
        items['filmyear']=filmyear

        #director导演
        director=response.xpath('//a[@rel="v:directedBy"]/text()').extract()
        items['director'] = '|'.join(director)
        #actor演员 演员列表
        actors=response.xpath('//a[@rel="v:starring"]/text()').extract()
        items['actors']='|'.join(actors)
        #type 类型 类型列表
        typea=response.xpath('//span[@property="v:genre"]/text()').extract()
        items['typea'] = '|'.join(typea)
        #property 上映时间
        property=response.xpath('//span[@property="v:initialReleaseDate"]/text()').extract()
        items['property'] = '|'.join(property)
        #片长
        pianchang = response.xpath('//span[@property="v:runtime"]/text()').extract()[0]
        items['pianchang'] = pianchang
        #制片国家
        #re.search() 找到一个
        #re.findall()找到所有
        pattern='制片国家/地区:</span>(.*?)<br/>'
        #调用group可以得到匹配的数据
        #group()调用出匹配到的整段，group(1)调用括号里面的第一个
        #例如country.group(1)调用到的就是括号里面的国家
        #country=re.search(pattern,response.text,re.S)
        countrygroup=self.zhengze(pattern,response.text)
        items['country'] = countrygroup
        #print('影片名字---',filmname,filmyear,'---','影片导演','--',director,actors,'--','--',typea,'--',property,'--',countrygroup)

        return items