import { useState } from "react";
import { Word } from "@/app/types/types";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  RefreshCcw, 
  Loader2, 
  ArrowRight 
} from "lucide-react";

const getPartOfSpeechAbbr = (pos: string): string => {
  const map: Record<string, string> = {
    'verb': 'v.',
    'noun': 'n.',
    'adjective': 'adj.',
    'adverb': 'adv.',
    'preposition': 'prep.',
    'conjunction': 'conj.',
    'pronoun': 'pron.',
    'interjection': 'interj.',
    'article': 'art.',
    'auxiliary': 'aux.',
  }
  return map[pos.toLowerCase()] || pos
};

interface WordSentencesProps {
  currentWord: Word;
  currentWordIndex: number;
  wordsLength: number;
  handlePrevWord: () => void;
  handleNextWord: () => void;
  playWordAudio: (word: string) => void;
  handleRegenerateSentence: (profession: string) => Promise<boolean>;
  playSentenceAudio: (sentence: string) => void;
  onNextChapter?: () => void;
}

export function WordSentences({ 
  currentWord,
  currentWordIndex,
  wordsLength,
  handlePrevWord,
  handleNextWord,
  playWordAudio,
  handleRegenerateSentence,
  playSentenceAudio,
  onNextChapter
}: WordSentencesProps) {
  const [regeneratingProfession, setRegeneratingProfession] = useState<string | null>(null);
  const [showTranslations, setShowTranslations] = useState<{ [key: string]: boolean }>({});
  const isLastWord = currentWordIndex === wordsLength - 1;

  // Helper function to handle regeneration with loading state
  const onRegenerateSentence = async (profession: string) => {
    setRegeneratingProfession(profession);
    await handleRegenerateSentence(profession);
    setRegeneratingProfession(null);
  };

  // 高亮句子中的单词
  const highlightWord = (sentence: string, word: string) => {
    // 创建一个不区分大小写的正则表达式
    const regex = new RegExp(`(${word})`, 'gi');
    
    // 将句子按照单词分割，并用 span 包裹需要高亮的部分
    return sentence.split(regex).map((part, index) => {
      if (part.toLowerCase() === word.toLowerCase()) {
        return <span key={index} className="font-bold text-blue-600">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="group relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5"></div>
      
      {/* Word header */}
      <div className="relative z-10 bg-background/60 p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full border-primary/20 bg-background/40 shadow-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-background/60 hover:shadow-md"
            onClick={handlePrevWord}
            disabled={currentWordIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <motion.h2 
              key={currentWord.word}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-4xl font-bold tracking-tighter"
            >
              {currentWord.word}
            </motion.h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => playWordAudio(currentWord.word)}
              className="h-9 w-9 rounded-full text-primary transition-transform hover:scale-110"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>

          {isLastWord && onNextChapter ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                onClick={onNextChapter}
                variant="outline"
                size="icon"
                className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 hover:border-emerald-500/50 hover:from-emerald-500/20 hover:to-teal-500/20 hover:text-emerald-500 dark:border-emerald-400/30 dark:text-emerald-400 dark:hover:text-emerald-300 transition-all duration-300"
              >
                <motion.div
                  animate={{ 
                    x: [0, 4, 0],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="flex items-center justify-center gap-1 relative z-10"
                >
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </motion.div>
                <motion.div
                  className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-lg shadow-emerald-500/20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                />
                <motion.div
                  className="absolute -inset-1 bg-[radial-gradient(circle_at_center,_var(--emerald-500)_0%,_transparent_70%)] opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                />
              </Button>
            </motion.div>
          ) : (
            <Button 
              variant="outline" 
              size="icon"
              className="h-10 w-10 shrink-0 rounded-full border-primary/20 bg-background/40 shadow-sm backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-background/60 hover:shadow-md"
              onClick={handleNextWord}
              disabled={currentWordIndex === wordsLength - 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Pronunciation */}
        {(currentWord.usphone || currentWord.ukphone) && (
          <div className="mt-4 flex justify-center gap-8 text-muted-foreground">
            {currentWord.usphone && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="group flex items-center gap-2 rounded-full bg-background/40 px-3 py-1 backdrop-blur-sm"
              >
                <span className="text-xs font-medium uppercase text-muted-foreground/70">US:</span>
                <span className="font-mono text-sm">{currentWord.usphone}</span>
              </motion.div>
            )}
            {currentWord.ukphone && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="group flex items-center gap-2 rounded-full bg-background/40 px-3 py-1 backdrop-blur-sm"
              >
                <span className="text-xs font-medium uppercase text-muted-foreground/70">UK:</span>
                <span className="font-mono text-sm">{currentWord.ukphone}</span>
              </motion.div>
            )}
          </div>
        )}
        
        {/* Meaning */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 space-y-1.5 text-center"
        >
          {Object.entries(
            (currentWord.translations || []).reduce((acc, translation) => {
              const { partOfSpeech, meaning } = translation;
              const abbr = getPartOfSpeechAbbr(partOfSpeech);
              if (!acc[abbr]) {
                acc[abbr] = [];
              }
              acc[abbr].push(meaning);
              return acc;
            }, {} as Record<string, string[]>)
          ).map(([partOfSpeech, meanings]) => (
            <div key={partOfSpeech} className="text-lg text-foreground/80">
              <span className="text-xs font-medium text-muted-foreground/70 mr-2">{partOfSpeech}</span>
              {meanings.join('；')}
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Progress */}
      <div className="relative z-10 border-t border-border/60 bg-background/40 px-6 py-4 backdrop-blur-md">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-base font-bold text-primary">{currentWordIndex + 1}</span>
              <span className="text-muted-foreground"> / {wordsLength}</span>
            </div>
          </div>

          <Progress 
            value={(currentWordIndex + 1) / wordsLength * 100} 
            className="h-2"
          />
        </div>
      </div>

      {/* Context sentences */}
      <div className="relative z-10 border-t border-border/60 bg-background/40 backdrop-blur-md">
        <ScrollArea>
          <div className="space-y-4 px-4 py-6">
            <AnimatePresence mode="popLayout">
              {currentWord.sentences && Object.keys(currentWord.sentences).length > 0 ? (
                Object.entries(currentWord.sentences).map(([profession, sentence], index) => (
                  <motion.div
                    key={`${profession}-${currentWordIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="group overflow-hidden border-border/60 transition-all duration-300 hover:border-primary/40 hover:shadow-md bg-card/60">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 bg-card/80 px-4 py-3">
                        <Badge variant="outline" className="bg-primary/5 px-3 py-1 text-xs font-medium whitespace-normal">
                          {profession}
                        </Badge>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full opacity-70 transition-opacity hover:bg-background hover:opacity-100"
                            onClick={() => onRegenerateSentence(profession)}
                            disabled={regeneratingProfession === profession}
                          >
                            {regeneratingProfession === profession ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <RefreshCcw className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full opacity-70 transition-opacity hover:bg-background hover:opacity-100"
                            onClick={() => playSentenceAudio(sentence.en)}
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </Button>
                          {sentence.zh && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full opacity-70 transition-opacity hover:bg-background hover:opacity-100"
                              onClick={() => setShowTranslations(prev => ({
                                ...prev,
                                [profession]: !prev[profession]
                              }))}
                            >
                              {showTranslations[profession] ? '隐' : '译'}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-background/40 px-4 py-3 backdrop-blur-sm">
                        {regeneratingProfession === profession ? (
                          <div className="flex items-center justify-center py-6">
                            <div className="flex items-center gap-3">
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              <span className="text-sm font-medium text-primary">重新生成例句...</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-lg leading-relaxed">{highlightWord(sentence.en, currentWord.word)}</p>
                            {sentence.zh && showTranslations[profession] && (
                              <p className="rounded-md bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
                                {sentence.zh}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="flex justify-center py-8 text-muted-foreground">
                  No example sentences available.
                </div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}