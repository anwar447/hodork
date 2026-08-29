import { School, User, Attendance, Excuse, Emergency } from '../types';
import { getTodayDateString } from '../utils/academic';

const FIRST_NAMES = [
  'محمد', 'عبدالله', 'عبدالرحمن', 'خالد', 'سعود', 'سلطان', 'فيصل', 'عمر', 'علي',
  'أحمد', 'يوسف', 'سلمان', 'فهد', 'عبدالعزيز', 'بندر', 'نايف', 'تركي', 'ريان',
  'مشاري', 'بدر', 'سعد', 'ماجد', 'وليد', 'إبراهيم', 'حسن', 'حسين', 'زياد', 'فراس',
  'طارق', 'حمزة', 'يزيد', 'مهند', 'طلال', 'سامي', 'حاتم', 'باسل', 'معاذ', 'عاصم'
];

const FATHER_NAMES = [
  'عبدالله', 'محمد', 'سعيد', 'صالح', 'ناصر', 'سليمان', 'منصور', 'إبراهيم',
  'خالد', 'علي', 'فهد', 'حسن', 'عبدالعزيز', 'عثمان', 'سالم', 'حمد', 'مبارك'
];

const FAMILY_NAMES = [
  'الغامدي', 'العتيبي', 'الدوسري', 'القحطاني', 'الشمري', 'الشهري', 'الحربي',
  'الزهراني', 'المطيري', 'العنزي', 'السبيعي', 'الخالدي', 'العمري', 'الرويلي',
  'السعيد', 'التميمي', 'البارقي', 'الجهني', 'المالكي', 'الشهراني', 'القرني'
];

// Curated avatar portraits for authentic Saudi students & staff
const AVATAR_PORTRAITS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

function generateSaudiName(seed: number): string {
  const first = FIRST_NAMES[seed % FIRST_NAMES.length];
  const father = FATHER_NAMES[(seed * 3) % FATHER_NAMES.length];
  const grandfather = FATHER_NAMES[(seed * 7 + 2) % FATHER_NAMES.length];
  const family = FAMILY_NAMES[(seed * 11) % FAMILY_NAMES.length];
  return `${first} ${father} ${grandfather} ${family}`;
}

export function generateInitialData(): {
  schools: School[];
  users: User[];
  attendances: Attendance[];
  excuses: Excuse[];
  emergencies: Emergency[];
} {
  const today = getTodayDateString();

  // 1. Initial Schools with Subscriptions & Timings
  const schools: School[] = [
    {
      id: 'sch-raya-1',
      name: 'متوسطة الراية للبنين',
      code: 'RAYA-1448',
      logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150&auto=format&fit=crop&q=80',
      city: 'الرياض',
      educationOffice: 'مكتب تعليم شمال الرياض',
      type: 'intermediate',
      contact: '0114567890',
      managerName: 'أ. صالح بن إبراهيم المنصور',
      timings: {
        tabour: '06:45',
        firstPeriod: '07:00',
        lateAfter: '07:15',
        absentAfter: '07:45',
        breakTime: '09:30',
        dismissal: '12:45',
      },
      geofence: {
        lat: 24.7136,
        lng: 46.6753,
        radius: 300, // 300 meters
        addressName: 'حي العليا - طريق الملك فهد، الرياض',
      },
      createdBy: '1000472181',
      subscriptionPlan: 'gold',
      subscriptionStartDate: '2026-01-01',
      subscriptionExpiryDate: '2026-12-31',
      maxStudents: 500,
      isSuspended: false,
      notes: 'اشتراك سنوي ذهبي مسدد بالكامل',
      createdAt: '2026-01-10',
    },
    {
      id: 'sch-saqr-2',
      name: 'ثانوية صقر قريش مسارات',
      code: 'SAQR-1448',
      logo: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=150&auto=format&fit=crop&q=80',
      city: 'الرياض',
      educationOffice: 'مكتب تعليم شمال الرياض',
      type: 'secondary',
      contact: '0119876543',
      managerName: 'د. خالد بن سلطان القحطاني',
      timings: {
        tabour: '06:45',
        firstPeriod: '07:00',
        lateAfter: '07:15',
        absentAfter: '07:45',
        breakTime: '09:45',
        dismissal: '13:15',
      },
      geofence: {
        lat: 24.7500,
        lng: 46.6500,
        radius: 350,
        addressName: 'حي النخيل - شارع التخصصي، الرياض',
      },
      createdBy: '1000472181',
      subscriptionPlan: 'silver',
      subscriptionStartDate: '2026-01-01',
      subscriptionExpiryDate: '2026-09-30',
      maxStudents: 600,
      isSuspended: false,
      notes: 'باقة المدارس الثانوية - فضية',
      createdAt: '2026-01-12',
    },
    {
      id: 'sch-fursan-3',
      name: 'مجمع الفرسان التعليمي الأهلية',
      code: 'FURS-1448',
      logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80',
      city: 'جدة',
      educationOffice: 'مكتب تعليم شمال جدة',
      type: 'combined',
      contact: '0126543210',
      managerName: 'أ. مروان بن فيصل الزهراني',
      timings: {
        tabour: '06:50',
        firstPeriod: '07:05',
        lateAfter: '07:20',
        absentAfter: '07:50',
        breakTime: '09:40',
        dismissal: '13:00',
      },
      geofence: {
        lat: 21.5433,
        lng: 39.1728,
        radius: 400,
        addressName: 'حي الروضة - شارع الأمير سلطان، جدة',
      },
      createdBy: '1022334455',
      subscriptionPlan: 'free_trial',
      subscriptionStartDate: '2026-08-01',
      subscriptionExpiryDate: '2026-08-31',
      maxStudents: 200,
      isSuspended: false,
      notes: 'فترة تجريبية مجانية 30 يوماً',
      createdAt: '2026-08-01',
    }
  ];

  const users: User[] = [];

  // Super Admin / Owner (المالك)
  users.push({
    id: 'usr-superadmin',
    nationalId: '9999999999',
    name: 'المشرف العام - مالك المنظومة',
    mobile: '0500009999',
    email: 'superadmin@hodork.sa',
    password: '9999',
    role: 'superadmin',
    schoolCode: 'GLOBAL',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  });

  // Founder Employee (الموظف المؤسس)
  users.push({
    id: 'usr-emp-founder',
    nationalId: '1000472181',
    name: 'عبدالرحمن بن صالح الشمري (المؤسس)',
    mobile: '0555472181',
    email: 'a.shammary@raya.edu.sa',
    password: '2181',
    role: 'employee',
    schoolCode: 'RAYA-1448',
    isAssistant: false,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  });

  // 4 Assistant Employees for RAYA-1448
  users.push(
    {
      id: 'usr-emp-asst-1',
      nationalId: '1022334455',
      name: 'سعود بن حمد التميمي (مساعد إداري)',
      mobile: '0551223344',
      email: 's.tamimi@raya.edu.sa',
      password: '4455',
      role: 'employee',
      schoolCode: 'RAYA-1448',
      isAssistant: true,
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      assistantPermissions: {
        canManageAttendance: true,
        canApproveExcuses: true,
        canBroadcastEmergency: true,
        canManageStudents: true,
      },
    },
    {
      id: 'usr-emp-asst-2',
      nationalId: '1033445566',
      name: 'تركي بن فهد الرويلي (وكيل شؤون الطلاب)',
      mobile: '0552334455',
      email: 't.ruwaili@raya.edu.sa',
      password: '5566',
      role: 'employee',
      schoolCode: 'RAYA-1448',
      isAssistant: true,
      photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      assistantPermissions: {
        canManageAttendance: true,
        canApproveExcuses: true,
        canBroadcastEmergency: true,
        canManageStudents: true,
      },
    },
    {
      id: 'usr-emp-asst-3',
      nationalId: '1044556677',
      name: 'سلطان بن عبدالعزيز المطيري (مساعد متابعة الحضور)',
      mobile: '0553445566',
      email: 's.mutairi@raya.edu.sa',
      password: '6677',
      role: 'employee',
      schoolCode: 'RAYA-1448',
      isAssistant: true,
      photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      assistantPermissions: {
        canManageAttendance: true,
        canApproveExcuses: false,
        canBroadcastEmergency: false,
        canManageStudents: true,
      },
    },
    {
      id: 'usr-emp-asst-4',
      nationalId: '1055667788',
      name: 'نايف بن بدر الحربي (مساعد الشؤون الإدارية)',
      mobile: '0554556677',
      email: 'n.harbi@raya.edu.sa',
      password: '7788',
      role: 'employee',
      schoolCode: 'RAYA-1448',
      isAssistant: true,
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      assistantPermissions: {
        canManageAttendance: true,
        canApproveExcuses: true,
        canBroadcastEmergency: false,
        canManageStudents: true,
      },
    }
  );

  // Key Test Teacher
  users.push({
    id: 'usr-teacher-test',
    nationalId: '1001691367',
    name: 'أ. فهد بن عبدالله بن عثمان القحطاني',
    mobile: '0501691367',
    email: 'f.qahtani@raya.edu.sa',
    password: '1367',
    role: 'teacher',
    schoolCode: 'RAYA-1448',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedGrades: ['الأول المتوسط', 'الثاني المتوسط', 'الثالث المتوسط'],
    assignedSections: ['أ', 'ب', 'ج', 'د', 'هـ'],
  });

  // Additional 65 Teachers
  for (let i = 2; i <= 66; i++) {
    const isSec = i > 33;
    const sCode = isSec ? 'SAQR-1448' : 'RAYA-1448';
    const nid = `10${String(10000000 + i * 193).slice(-8)}`;
    const pass = nid.slice(-4);
    const assignedGrade = isSec ? 'الأول الثانوي' : 'الأول المتوسط';
    const assignedSec = ['أ', 'ب', 'ج', 'د', 'هـ'][i % 5];
    
    users.push({
      id: `usr-teacher-${i}`,
      nationalId: nid,
      name: `أ. ${generateSaudiName(i * 13)}`,
      mobile: `050${String(1000000 + i * 23).slice(-7)}`,
      email: `teacher${i}@${isSec ? 'saqr' : 'raya'}.edu.sa`,
      password: pass,
      role: 'teacher',
      schoolCode: sCode,
      photoUrl: AVATAR_PORTRAITS[i % AVATAR_PORTRAITS.length],
      assignedGrades: [assignedGrade, isSec ? 'الثاني الثانوي' : 'الثاني المتوسط'],
      assignedSections: [assignedSec, 'أ'],
    });
  }

  // Key Test Students
  // 1. High School student Mohammed (طالب ثانوي)
  const highSchoolTestStudent: User = {
    id: 'usr-student-saqr-test',
    nationalId: '2497120754',
    name: 'محمد بن خالد بن مبارك الدوسري',
    mobile: '0549712075',
    email: 'm.dossary@student.sa',
    password: '0754',
    role: 'student',
    schoolCode: 'SAQR-1448',
    className: 'الأول الثانوي',
    sectionName: 'ب',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  };
  users.push(highSchoolTestStudent);

  // 2. Middle School student Rayan (طالب متوسط)
  const midSchoolTestStudent: User = {
    id: 'usr-student-raya-test',
    nationalId: '1169016985',
    name: 'ريان بن أحمد بن صالح الغامدي',
    mobile: '0516901698',
    email: 'r.ghamdi@student.sa',
    password: '6985',
    role: 'student',
    schoolCode: 'RAYA-1448',
    className: 'الأول المتوسط',
    sectionName: 'أ',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  };
  users.push(midSchoolTestStudent);

  // Parent account
  users.push({
    id: 'usr-parent-1',
    nationalId: '1023456789',
    name: 'خالد بن مبارك الدوسري (ولي أمر)',
    mobile: '0502345678',
    email: 'k.dossary@gmail.com',
    password: '6789',
    role: 'parent',
    schoolCode: 'SAQR-1448',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    childrenNationalIds: ['2497120754', '1169016985'],
  });

  // Generate 331 more students for Middle School (Total = 332 students)
  const middleGrades = ['الأول المتوسط', 'الثاني المتوسط', 'الثالث المتوسط'];
  const sections = ['أ', 'ب', 'ج', 'د', 'هـ'];

  for (let i = 2; i <= 332; i++) {
    const nid = `11${String(10000000 + i * 491).slice(-8)}`;
    const pass = nid.slice(-4);
    const gr = middleGrades[(i - 1) % middleGrades.length];
    const sec = sections[(i - 1) % sections.length];

    users.push({
      id: `usr-mid-std-${i}`,
      nationalId: nid,
      name: generateSaudiName(i * 17 + 5),
      mobile: `05${String(10000000 + i * 317).slice(-8)}`,
      email: `std.mid.${i}@raya.edu.sa`,
      password: pass,
      role: 'student',
      schoolCode: 'RAYA-1448',
      className: gr,
      sectionName: sec,
      photoUrl: AVATAR_PORTRAITS[i % AVATAR_PORTRAITS.length],
    });
  }

  // Generate 383 more students for High School (Total = 384 students)
  const highGrades = ['الأول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي'];

  for (let i = 2; i <= 384; i++) {
    const nid = `12${String(20000000 + i * 383).slice(-8)}`;
    const pass = nid.slice(-4);
    const gr = highGrades[(i - 1) % highGrades.length];
    const sec = sections[(i - 1) % sections.length];

    users.push({
      id: `usr-high-std-${i}`,
      nationalId: nid,
      name: generateSaudiName(i * 29 + 11),
      mobile: `05${String(20000000 + i * 419).slice(-8)}`,
      email: `std.high.${i}@saqr.edu.sa`,
      password: pass,
      role: 'student',
      schoolCode: 'SAQR-1448',
      className: gr,
      sectionName: sec,
      photoUrl: AVATAR_PORTRAITS[(i + 3) % AVATAR_PORTRAITS.length],
    });
  }

  // Attendances for Today
  const attendances: Attendance[] = [];
  const allStudents = users.filter((u) => u.role === 'student');

  allStudents.forEach((student, idx) => {
    let selfCheckTime: string | null = null;
    let teacherMark: 'present' | 'absent' | 'late' | 'excused' = 'present';
    let isTruant = false;

    if (student.nationalId === '2497120754') {
      // Test High School student: checked in on time!
      selfCheckTime = '06:52:14';
      teacherMark = 'present';
    } else if (student.nationalId === '1169016985') {
      // Test Middle School student: checked in!
      selfCheckTime = '06:58:30';
      teacherMark = 'present';
    } else if (idx === 7 || idx === 18) {
      // Truant demo student! Registered on mobile at 06:48, but slipped away/missing from classroom -> teacher marked absent!
      selfCheckTime = '06:48:10';
      teacherMark = 'absent';
      isTruant = true;
    } else if (idx % 15 === 0) {
      // Absent
      selfCheckTime = null;
      teacherMark = 'absent';
    } else if (idx % 11 === 0) {
      // Late arrival
      selfCheckTime = '07:22:45';
      teacherMark = 'late';
    } else {
      // Normal present
      const min = 40 + (idx % 25);
      const sec = (idx * 13) % 60;
      selfCheckTime = `06:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
      teacherMark = 'present';
    }

    const finalStatus = isTruant ? 'absent' : teacherMark;

    attendances.push({
      id: `att-${student.id}-${today}`,
      studentId: student.id,
      studentName: student.name,
      nationalId: student.nationalId,
      schoolCode: student.schoolCode,
      className: student.className || 'الأول المتوسط',
      sectionName: student.sectionName || 'أ',
      date: today,
      selfCheckTime,
      teacherMark,
      finalStatus,
      isTruant,
      photoUrl: student.photoUrl,
      overrideLocation: false,
      updatedAt: new Date().toISOString(),
    });
  });

  // Sample Excuses
  const excuses: Excuse[] = [
    {
      id: 'exc-1',
      studentId: 'usr-student-saqr-test',
      studentName: 'محمد بن خالد بن مبارك الدوسري',
      nationalId: '2497120754',
      schoolCode: 'SAQR-1448',
      className: 'الأول الثانوي',
      sectionName: 'ب',
      date: '2026-08-25',
      type: 'medical',
      description: 'إجازة مرضية معتمدة من منصة صحتي - مراجعة عيادة الأسنان',
      file: 'sehhaty-excuse-88491.pdf',
      parentNote: 'مرفق تقرير مستشفى الملك فيصل التخصصي',
      status: 'approved',
      submittedAt: '2026-08-25 08:30:00',
    },
    {
      id: 'exc-2',
      studentId: 'usr-student-raya-test',
      studentName: 'ريان بن أحمد بن صالح الغامدي',
      nationalId: '1169016985',
      schoolCode: 'RAYA-1448',
      className: 'الأول المتوسط',
      sectionName: 'أ',
      date: '2026-08-24',
      type: 'family',
      description: 'ظرف عائلي طارئ ومرافقة الوالد',
      parentNote: 'أرجو التكرم بقبول العذر',
      status: 'pending',
      submittedAt: '2026-08-24 07:15:00',
    },
  ];

  // Emergencies
  const emergencies: Emergency[] = [
    {
      id: 'emg-1',
      schoolCode: 'RAYA-1448',
      message: 'تنبيه: نظراً للحالة المطرية الغزيرة، تم تحويل الدوام الحضوري إلى منصة مدرستي عن بُعد اعتباراً من الحصة الرابعة.',
      type: 'rain',
      date: today,
      createdAt: '2026-08-26 06:15:00',
      active: true,
      responses: [
        {
          userId: 'usr-teacher-test',
          userName: 'أ. فهد بن عبدالله القحطاني',
          role: 'teacher',
          status: 'acknowledged',
          respondedAt: '06:20',
          note: 'تم إشعار طلاب الصف الأول المتوسط بالدخول للمنصة',
        },
        {
          userId: 'usr-parent-1',
          userName: 'خالد بن مبارك الدوسري (ولي أمر)',
          role: 'parent',
          status: 'safe',
          respondedAt: '06:25',
          note: 'استلمت الإشعار، الأبناء في المنزل بأمان',
        }
      ],
    },
  ];

  return { schools, users, attendances, excuses, emergencies };
}
