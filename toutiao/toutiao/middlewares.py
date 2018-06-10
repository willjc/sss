# -*- coding: utf-8 -*-

# Define here the models for your spider middleware
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/spider-middleware.html

from scrapy import signals
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from fake_useragent import FakeUserAgent
from urllib.parse import urlencode
from scrapy.http import TextResponse
from fake_useragent import FakeUserAgent
class ToutiaoSpiderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        # Called for each response that goes through the spider
        # middleware and into the spider.

        # Should return None or raise an exception.
        return None

    def process_spider_output(self, response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, dict or Item objects.
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (from other spider middleware) raises an exception.

        # Should return either None or an iterable of Response, dict
        # or Item objects.
        pass

    def process_start_requests(self, start_requests, spider):
        # Called with the start requests of the spider, and works
        # similarly to the process_spider_output() method, except
        # that it doesn’t have a response associated.

        # Must return only requests (not items).
        for r in start_requests:
            yield r

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)


class ToutiaoDownloaderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the downloader middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_request(self, request, spider):
        # Called for each request that goes through the downloader
        # middleware.
        # ua=FakeUserAgent()
        # request.headers['User-Agent'] = ua.random
        # print(request.headers['User-Agent'])

        # Must either:
        # - return None: continue processing this request
        # - or return a Response object
        # - or return a Request object
        # - or raise IgnoreRequest: process_exception() methods of
        #   installed downloader middleware will be called
        return None

    def process_response(self, request, response, spider):
        # Called with the response returned from the downloader.

        # Must either;
        # - return a Response object
        # - return a Request object
        # - or raise IgnoreRequest
        return response

    def process_exception(self, request, exception, spider):
        # Called when a download handler or a process_request()
        # (from other downloader middleware) raises an exception.

        # Must either:
        # - return None: continue processing this exception
        # - return a Response object: stops process_exception() chain
        # - return a Request object: stops process_exception() chain
        pass

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)
# class ToutiaoSignMiddleWare(object):
#     def __init__(self):
#         chrome_options = Options()
#         chrome_options.add_argument('--headless')
#         self.brower=webdriver.Chrome(chrome_options=chrome_options)
#     def process_request(self,request,spider):
#
#         self.brower.get(request.url)
#         userid=request.meta.get('userid')
#         #sinature = firefox.execute_script('return TAC.sign(' + str(user_id) + str(max_behot_time) + ')')
#         sinature = self.brower.execute_script('return TAC.sign(' + str(userid) + str('1234567') + ')')
#         print('return TAC.sign(' + str(userid) + str('1234567') + ')')
#         print(sinature)
#         return None
#         #self.brower.execute_script('return TAC.sign+str(userid)+str(max_behot_time)')
# class ToutiaoMiddleWare(object):
#     def __init__(self):
#
#         self.chrome_options = Options()
#         self.chrome_options.add_argument('--headless')
#         self.brower = webdriver.Chrome(chrome_options=self.chrome_options)
#     def process_request(self,request,spider):
#
#         self.brower.get(request.url)
#         userinfoid=request.meta.get('userinfoid')
#         cursor=request.meta.get('cursor')
#         baseurl=request.meta.get('baseurl')
#         sign = self.brower.execute_script('return TAC.sign(' + str(userinfoid) + str(cursor) + ')')
#         canshu = {"user_id": userinfoid, "cursor": cursor, "count": 20, "_signature": sign}
#         url = baseurl + urlencode(canshu)
#         return TextResponse(url=url,body=self.brower.page_source,request=request,encoding='utf-8',status=200)


