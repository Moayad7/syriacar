
import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import axiosInstance from '@/config/axiosConfig';
import axios from 'axios';
import Spinner from '@/components/ui/Spinner';
import SpinnerSm from '@/components/ui/Spinner-sm';


interface Question {
  id: number;
  text: string;
  options: { id: string; text: string }[];
}



// const questions: Question[] = [
//   {
//     id: 1,
//     text: 'ما هو الغرض الرئيسي لاستخدام السيارة؟',
//     options: [
//       { id: 'a', text: 'التنقل داخل المدينة' },
//       { id: 'b', text: 'رحلات طويلة بين المدن' },
//       { id: 'c', text: 'نقل العائلة' },
//       { id: 'd', text: 'استخدام تجاري' },
//     ],
//   },
//   {
//     id: 2,
//     text: 'ما هو نوع الطرق التي تقود عليها عادة؟',
//     options: [
//       { id: 'a', text: 'طرق معبدة في المدينة' },
//       { id: 'b', text: 'طرق سريعة' },
//       { id: 'c', text: 'طرق غير معبدة' },
//       { id: 'd', text: 'مزيج من الطرق المختلفة' },
//     ],
//   },
//   {
//     id: 3,
//     text: 'كم عدد الركاب الذين تنقلهم عادة؟',
//     options: [
//       { id: 'a', text: 'شخص أو شخصين' },
//       { id: 'b', text: '3-4 أشخاص' },
//       { id: 'c', text: '5-7 أشخاص' },
//       { id: 'd', text: 'أكثر من 7 أشخاص' },
//     ],
//   },
//   {
//     id: 4,
//     text: 'ما نوع الوقود الذي تفضله؟',
//     options: [
//       { id: 'a', text: 'بنزين' },
//       { id: 'b', text: 'ديزل' },
//       { id: 'c', text: 'هجين (هايبرد)' },
//       { id: 'd', text: 'كهربائي' },
//     ],
//   },
//   {
//     id: 5,
//     text: 'ما هي ميزانيتك لشراء السيارة؟',
//     options: [
//       { id: 'a', text: 'أقل من 10,000 دولار' },
//       { id: 'b', text: '10,000 - 20,000 دولار' },
//       { id: 'c', text: '20,000 - 30,000 دولار' },
//       { id: 'd', text: 'أكثر من 30,000 دولار' },
//     ],
//   },
// ];

const carRecommendations: Record<string, any[]> = {
  'aabaa': [
    { name: 'تويوتا يارس', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=400', price: '9,500$' },
    { name: 'هيونداي إلنترا', image: 'https://images.unsplash.com/photo-1617814076067-da0dcc9407a9?auto=format&fit=crop&q=80&w=400', price: '10,500$' },
  ],
  'abcaa': [
    { name: 'كيا سبورتاج', image: 'https://images.unsplash.com/photo-1631144482731-a19b0f78f98c?auto=format&fit=crop&q=80&w=400', price: '19,500$' },
    { name: 'هيونداي توسان', image: 'https://images.unsplash.com/photo-1634807064328-78bc82b3f8e9?auto=format&fit=crop&q=80&w=400', price: '20,000$' },
  ],
  'bcdcc': [
    { name: 'تويوتا لاند كروزر', image: 'https://images.unsplash.com/photo-1623843146476-616d9833cd9a?auto=format&fit=crop&q=80&w=400', price: '28,500$' },
    { name: 'جيب جراند شيروكي', image: 'https://images.unsplash.com/photo-1544793828-1d6c2c4442c6?auto=format&fit=crop&q=80&w=400', price: '29,900$' },
  ],
  'cdadd': [
    { name: 'مرسيدس بنز الفئة E', image: 'https://images.unsplash.com/photo-1563720223523-110fd0a81c2e?auto=format&fit=crop&q=80&w=400', price: '35,000$' },
    { name: 'بي إم دبليو الفئة 5', image: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&q=80&w=400', price: '37,500$' },
  ],
};

const defaultRecommendations = [
  { name: 'تويوتا كورولا', image: 'https://images.unsplash.com/photo-1623869675184-d9ec98537a2d?auto=format&fit=crop&q=80&w=400', price: '17,500$' },
  { name: 'هوندا سيفيك', image: 'https://images.unsplash.com/photo-1622551957961-b8a74fe36dd6?auto=format&fit=crop&q=80&w=400', price: '18,900$' },
];

const KnowYourNeeds = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [carRecommendations , setCarRecommendations] = useState<[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);



      // Fetch car data from the API
  useEffect(() => {
    const fetchَQuesions = async () => {
      try {
        const response = await axiosInstance.get('/api/questions'); // Adjust the endpoint as necessary
        setQuestions(response.data.data);
        
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("حدث خطأ أثناء تحميل السيارات");
      } finally {
        setLoading(false);
      }
    };

    fetchَQuesions();
  }, []);


  
  const handleAnswer = (questionId: number, chosen_option_id: string) => {
    setAnswers({ ...answers, [questionId]: chosen_option_id });
  };
  
  
const handleNext = async () => {
  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
    
  } else {
    // Prepare the data to be sent in the desired format
    setIsSubmitting(true);
    const submissionData = Object.entries(answers).map(([questionId, chosen_option_id]) => ({
      question_id: parseInt(questionId), // Convert to number if needed
      chosen_option_id,
    }));

    try {
      // Send the data to your API endpoint
      const response = await axiosInstance.post('/api/car-recommendations', { answers: submissionData });
      console.log({ answers: submissionData })
      console.log(response)
      console.log(response.data.data)
      setCarRecommendations(response.data.data)
      setShowResults(true);
    } catch (error) {
      console.log({ answers: submissionData })
      console.error("Error submitting answers:", error);
      setError("حدث خطأ أثناء إرسال الإجابات");
    } finally{
      setIsSubmitting(false);
    }

    setIsSubmitting(false);
  }
};


  
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const getRecommendations = () => {
    // if (Object.keys(answers).length !== questions.length) {
    //   return defaultRecommendations;
    // }
    
    // const answerKey = questions.map(q => answers[q.id]).join('');
    // return carRecommendations[answerKey] || defaultRecommendations;
    return carRecommendations.slice(0, -1) || "لا يوجد نتائج مطابقة"
  };
  
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  if (loading) {
    return <div><Spinner/></div>; // Show loading state
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  
  return (
    <MainLayout>
      <div className="container-custom py-28">
        <div className="text-center mb-12">
          <h1 className="heading-2 mb-4">اعرف احتياجاتك</h1>
          <p className="subtitle mx-auto">أجب على الأسئلة البسيطة التالية لمساعدتك في اختيار السيارة المناسبة لاحتياجاتك وميزانيتك.</p>
        </div>
        
        {!showResults ? (
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span>السؤال {currentQuestion + 1} من {questions.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-6">{questions[currentQuestion].text}</h2>
                
                <RadioGroup 
                  value={answers[questions[currentQuestion].id]} 
                  onValueChange={(value) => handleAnswer(questions[currentQuestion].id, value)}
                  className="space-y-3"
                >
                  {questions[currentQuestion].options.map((option) => (
                    <div 
                      key={option.id}
                      className={`flex items-center space-x-2 rtl:space-x-reverse rounded-lg border p-4 cursor-pointer transition-all ${
                        answers[questions[currentQuestion].id] === option.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/30 hover:bg-primary/5'
                      }`}
                      onClick={() => handleAnswer(questions[currentQuestion].id, option.id)}
                    >
                      <RadioGroupItem 
                        value={option.id} 
                        id={`option-${option.id}`} 
                        className="ml-3 rtl:mr-3 rtl:ml-0" 
                      />
                      <label 
                        htmlFor={`option-${option.id}`}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {option.text}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentQuestion === 0}
                >
                  السابق
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!answers[questions[currentQuestion].id] || isSubmitting}
                >
                  {isSubmitting ?  (
                    <>
                      جارٍ إحضار النتائج...
                       <SpinnerSm  />
                    </>
                  ) : 
                  currentQuestion === questions.length - 1 ? 'إظهار النتائج' : 'التالي'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">توصياتنا لك</h2>
                    <p className="text-muted-foreground">بناءً على إجاباتك، نعتقد أن هذه السيارات ستناسب احتياجاتك.</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid  gap-6">
                  {getRecommendations().map((car, index) => (
                    <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md border border-border/30">
                      {/* <div className="relative h-48">
                        <img src={car.image} alt={car.name} className="h-full w-full object-cover" />
                      </div> */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{car}</h3>
                        {/* <div className="flex justify-between mb-4">
                          <span className="text-primary font-bold">{car.price}</span>
                        </div> */}
                        {/* <Button className="w-full">عرض التفاصيل</Button> */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-2">ملاحظة مهمة</h3>
                <p className="text-muted-foreground">
                  {carRecommendations[carRecommendations.length-1]}
                </p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Button variant="outline" onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({});
              }}>
                البدء من جديد
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default KnowYourNeeds;
