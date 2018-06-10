# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy
from scrapy.loader.processors import MapCompose,Compose,Join

class ToutiaoItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    open_url=scrapy.Field()
    user_id=scrapy.Field()
    description=scrapy.Field()
    bg_img_url=scrapy.Field()
    user_verified=scrapy.Field()
    verified_content=scrapy.Field()
    avatar_url=scrapy.Field()
    cf_info=scrapy.Field()
    verified_agency=scrapy.Field()
    media_id=scrapy.Field()
    cf_count=scrapy.Field()
    is_pgc=scrapy.Field()
    relation_status=scrapy.Field()
    name=scrapy.Field()

