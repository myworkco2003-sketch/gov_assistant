ollama pull bge-m3
ollama pull qwen2.5:7b-instruct
python -m venv venv
source venv/bin/activate        # ويندوز: venv\Scripts\activate
pip install -r requirements.txt
python ingest.py
uvicorn server:app --host 127.0.0.1 --port 8000




MAX_DISTANCE (0.55) رقم تقديري. كل ما صغّرته صار أصرم ورفض أسئلة أكتر. لازم تعايره على أسئلة حقيقية، وهاد دور مجموعة الاختبار.

ملف unanswered.log بيسجل الأسئلة اللي ما لقى لها جواب لنعرف شو ينقص المحتوى. المستخدم ممكن يكتب بيانات شخصية بالسؤال، فخليه بمكان محمي وامسحه دوريًا.