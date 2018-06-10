# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

from pymongo import MongoClient,InsertOne
from scrapy import Request
from scrapy.pipelines.images import ImagesPipeline
from scrapy.exceptions import DropItem

class Spidertest1Pipeline(object):
    def process_item(self, item, spider):
        return item
class Spiderimg360mongodbPipeline(object):
    def open_spider(self,spider):
        self.client=MongoClient()
        self.db=self.client.img360
    def close_spidr(self,spider):
        self.client.close()
    def process_item(self,item,spider):
        col=self.db.img360info
        min=InsertOne(dict(item))
        col.bulk_write([min])
        return item
class ImagePipeline(ImagesPipeline):
    def file_path(self, request, response=None, info=None):
        url=request.url
        file_name=url.split('/')[-1]
        return  file_name
    def item_completed(self, results, item, info):
        image_paths=[x['path'] for ok,x in results if ok]
        if not image_paths:
            raise DropItem('image downed failed')
        return item
    def get_media_requests(self, item, info):
        yield Request(item['url'])

