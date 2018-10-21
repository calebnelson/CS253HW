#!/usr/bin/env python 
import re, sys, operator 

#Mileage may vary. If this crashes, make it lower 
RECURSION_LIMIT = 900 
#We add a few more, because, contrary to the name, 
#this doesn't just rule recursion: it rules the 
#depth of the call stack 
sys.setrecursionlimit(RECURSION_LIMIT+10)

Y = lambda f: (lambda x: x(x))(lambda y: f(lambda *args: y(y)(*args)))

cnt = lambda f: lambda word_list: lambda wordfreqs: (wordfreqs if (len(word_list) == 0) else (f(word_list[1:])((dict(iter([(key, value+1) if (key == word_list[0]) else (key, value) for key, value in wordfreqs.items()]))) if (word_list[0] in wordfreqs.keys()) else (dict(iter([(key, value) for key, value in wordfreqs.items()]+[(word_list[0], 1)]))))))

def wf_print(wordfreq): 
	if wordfreq == []: 
		return 
	else: 
		(w, c) = wordfreq[0] 
		print (w, c)
		wf_print(wordfreq[1:]) 

stop_words = set(open('../stop_words.txt').read().split(','))
unfiltered_words = re.findall('[a-z]{2,}', open('../pride-and-prejudice.txt').read().lower())
words = [word for word in unfiltered_words if not word in stop_words and len(word)>1]
word_freqs = {} 
#Theoretically, we would just call count(words, word_freqs) 
#Try doing that and see what happens. 
for i in range(0, len(words), RECURSION_LIMIT):
  word_freqs = Y(cnt)(words[i:i+RECURSION_LIMIT])(word_freqs)
  #count(words[i:i+RECURSION_LIMIT], stop_words, word_freqs) 


wf_print(sorted(word_freqs.items(), key=operator.itemgetter(1) , reverse=True)[:25])
