import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Course } from "@/types";
import { FileText, Users, Clock, BookOpen, MessageSquare, GraduationCap, Star } from "lucide-react";
import { CourseDetailsSkeleton } from "@/components/skeletons/CourseDetailsSkeleton";
import { FloatingButtons } from "@/components/FloatingButtons";

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const { user, userDoc } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      const snap = await getDoc(doc(db, "courses", courseId));
      if (snap.exists()) setCourse({ id: snap.id, ...snap.data() } as Course);
      
      if (user) {
        const q = query(collection(db, "enrollRequests"), where("userId", "==", user.uid), where("courseId", "==", courseId), where("status", "==", "pending"));
        const reqSnap = await getDocs(q);
        setHasPendingRequest(!reqSnap.empty);
      }
      
      setLoading(false);
    };
    fetchData();
  }, [courseId, user]);

  if (loading) return <CourseDetailsSkeleton />;
  if (!course) return <div className="p-4 text-center text-muted-foreground">Course not found.</div>;

  const isEnrolled = userDoc?.enrolledCourses?.some((c) => c.courseId === courseId);

  const handleEnroll = () => {
    if (!user) navigate(`/auth?mode=register&courseId=${courseId}`);
    else if (!isEnrolled) navigate(`/auth?mode=register&courseId=${courseId}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="max-w-3xl mx-auto p-4 lg:p-8 space-y-6">
        
        {/* Hero: Thumbnail */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border/50">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.courseName}
              className="w-full aspect-video object-cover"
            />
          ) : (
            <div className="w-full aspect-video bg-muted flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-muted-foreground/20" />
            </div>
          )}
          {/* Price badge */}
          <div className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg backdrop-blur-sm">
            ৳{course.price}
          </div>
        </div>

        {/* Title & CTA */}
        <div className="space-y-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">{course.courseName}</h1>
          
          {/* CTA Button */}
          {isEnrolled && !hasPendingRequest ? (
            <Link to="/my-courses" className="block w-full text-center px-6 py-3.5 text-sm font-semibold rounded-xl bg-success text-success-foreground shadow-sm hover:opacity-90 transition-opacity">
              ✅ Visit Course
            </Link>
          ) : hasPendingRequest ? (
            <div className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium rounded-xl bg-warning/15 text-warning border border-warning/30">
              <Clock className="h-4 w-4" /> Pending Approval
            </div>
          ) : (
            <button onClick={handleEnroll} className="w-full px-6 py-3.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground shadow-sm hover:opacity-90 transition-opacity active:scale-[0.98]">
              Enroll Now — ৳{course.price}
            </button>
          )}
        </div>

        {/* Overview */}
        {course.overview?.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" /> Overview
            </h3>
            <ul className="space-y-2.5">
              {course.overview.map((point, i) => (
                <li key={i} className="text-muted-foreground text-sm flex gap-2.5">
                  <span className="text-primary font-bold mt-0.5 flex-shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Subjects */}
        {course.subjects?.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Subjects ({course.subjects.length})
            </h3>
            <div className="space-y-2">
              {course.subjects.map((s) => (
                <div key={s.subjectId} className="flex items-center justify-between px-4 py-3 rounded-xl bg-accent/30 border border-border/50">
                  <span className="text-sm font-medium text-foreground">{s.subjectName}</span>
                  {s.chapters?.length ? (
                    <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">{s.chapters.length} chapters</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructors */}
        {course.instructors?.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Instructors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.instructors.map((inst, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-accent/30 border border-border/50">
                  {inst.image ? (
                    <img src={inst.image} alt={inst.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{inst.name[0]}</div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{inst.name}</p>
                    <p className="text-xs text-muted-foreground">{inst.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Routine PDF only (All Materials removed) */}
        {course.routinePDF && (
          <a href={course.routinePDF} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-card border border-border hover:bg-accent transition-colors">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Routine PDF</span>
          </a>
        )}
      </div>

      <FloatingButtons course={course} />
    </div>
  );
}
