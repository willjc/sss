# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy
from scrapy.loader.processors import Join,MapCompose,Compose
def geshihua(info):
    return info.split('|')
class Spidertest1Item(scrapy.Item):
    # print('影片名字---',filmname,filmyear,'---','影片导演','--'
     #,director,actors,'--','--',typea,'--',property,'--',countrygroup)

    # define the fields for your item here like:
    # name = scrapy.Field()
    filmname =scrapy.Field(output_processor=Join())
    filmyear = scrapy.Field()
    director = scrapy.Field(output_processor=Join())
    actors = scrapy.Field(output_processor=Join())
    typea = scrapy.Field()
    property = scrapy.Field()
    pianchang=scrapy.Field()
    country = scrapy.Field(input_processor=MapCompose(str.strip))
