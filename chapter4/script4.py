import xml.etree.ElementTree as ET
import os
import copy
import glob
import re

# フォルダ名の指定
INPUT_FOLDER = os.path.dirname(__file__) + '/xml_input/' # 読み込むdata.xmlを格納する
OUTPUT_FOLDER = os.path.dirname(__file__) + '/xml_output/' # 生成するdata.xmlを格納する
IMAGES_FOLDER = os.path.dirname(__file__) + '/images/' # カードの画像ファイルを格納する
GITHUB_URL = \
    'https://github.com/hanshakaijin/tech_of_card/raw/master/chapter4/images/'

# カードの画像ファイルの洗い出し
filelist = glob.glob(IMAGES_FOLDER + "card_front*")
front_cards = []
for filename in filelist:
    front_card_name = re.search('card_front.*$', filename)
    front_cards.append(front_card_name.group(0))

# data.xmlの読み込み
dataxml = ET.parse(INPUT_FOLDER + 'data.xml')
root = dataxml.getroot()
cards = root.findall('./card-stack/node/')

base_card = cards[0]
new_cards = []

# 画像URLを置き換えたcard要素の生成
for front_card in front_cards:
    tmp_card = copy.deepcopy(base_card)
    tmp_card_front_image = tmp_card.findall(".//*[@name='front']")
    tmp_card_front_image[0].text = GITHUB_URL + front_card

    tmp_card_back_image = tmp_card.findall(".//*[@name='back']")
    tmp_card_back_image[0].text = GITHUB_URL + 'card_back.png'

    new_cards.append(tmp_card)

# card要素の置き換え
node = root.findall('./card-stack/node')

for c in node[0].findall('card'):
    node[0].remove(c)

node[0].extend(new_cards)

# data.xmlの書き込み
ET.ElementTree(element=root).write(OUTPUT_FOLDER + 'data.xml', encoding='UTF-8')