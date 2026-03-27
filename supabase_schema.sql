-- 비상장주식 정보 플랫폼 데이터베이스 스키마

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 업종 테이블
CREATE TABLE IF NOT EXISTS industries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 회사 테이블
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  industry_id UUID REFERENCES industries(id) ON DELETE SET NULL,
  founded_year INTEGER,
  employee_count INTEGER,
  revenue BIGINT, -- 연간 매출액 (원)
  location VARCHAR(200),
  website VARCHAR(255),
  ceo_name VARCHAR(100),
  investment_stage VARCHAR(50), -- 시드, 시리즈A, 시리즈B, 시리즈C, 성장기, 성숙기
  market_position TEXT,
  logo_url VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 재무 데이터 테이블
CREATE TABLE IF NOT EXISTS financial_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  revenue BIGINT,
  profit BIGINT,
  assets BIGINT,
  liabilities BIGINT,
  equity BIGINT,
  growth_rate DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, year)
);

-- 회사 문서 테이블
CREATE TABLE IF NOT EXISTS company_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  document_type VARCHAR(50), -- annual_report, financial_statement, investor_presentation, business_plan
  file_url VARCHAR(500) NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 프로필 테이블 (auth.users 확장)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  location VARCHAR(200),
  bio TEXT,
  website VARCHAR(255),
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'user', -- user, company_rep, admin
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  notifications BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 커뮤니티 게시물 테이블
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  post_type VARCHAR(50) DEFAULT 'question', -- question, discussion, announcement
  tags TEXT[], -- 태그 배열
  is_pinned BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_official_answer BOOLEAN DEFAULT FALSE, -- 공식 답변 여부 (회사 담당자)
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 좋아요 테이블
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id, comment_id)
);

-- 관심 기업 테이블
CREATE TABLE IF NOT EXISTS favorite_companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- 공지사항 테이블
CREATE TABLE IF NOT EXISTS notices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 활동 로그 테이블
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- login, logout, view_company, create_post, etc.
  resource_type VARCHAR(50), -- company, post, comment, etc.
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_companies_industry_id ON companies(industry_id);
CREATE INDEX idx_companies_created_at ON companies(created_at);
CREATE INDEX idx_financial_data_company_id ON financial_data(company_id);
CREATE INDEX idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX idx_community_posts_company_id ON community_posts(company_id);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_favorite_companies_user_id ON favorite_companies(user_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- RLS (Row Level Security) 정책
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Industries: 모두 읽기 가능, 관리자만 쓰기 가능
CREATE POLICY "Industries are viewable by everyone" ON industries
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify industries" ON industries
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Companies: 모두 읽기 가능, 관리자와 회사 담당자만 쓰기 가능
CREATE POLICY "Companies are viewable by everyone" ON companies
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins and company reps can modify companies" ON companies
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'company_rep')
    )
  );

-- Financial Data: 모두 읽기 가능, 관리자만 쓰기 가능
CREATE POLICY "Financial data is viewable by everyone" ON financial_data
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify financial data" ON financial_data
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Company Documents: 공개 문서는 모두 읽기 가능
CREATE POLICY "Public documents are viewable by everyone" ON company_documents
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own uploaded documents" ON company_documents
  FOR SELECT USING (auth.uid() = uploaded_by);

CREATE POLICY "Admins and company reps can manage documents" ON company_documents
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role IN ('admin', 'company_rep')
    )
  );

-- Profiles: 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Community Posts: 모두 읽기 가능, 로그인한 사용자는 작성 가능
CREATE POLICY "Community posts are viewable by everyone" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all posts" ON community_posts
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Comments: 모두 읽기 가능, 로그인한 사용자는 작성 가능
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all comments" ON comments
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Likes: 로그인한 사용자만 관리 가능
CREATE POLICY "Users can manage own likes" ON likes
  FOR ALL USING (auth.uid() = user_id);

-- Favorite Companies: 로그인한 사용자만 관리 가능
CREATE POLICY "Users can manage own favorites" ON favorite_companies
  FOR ALL USING (auth.uid() = user_id);

-- Notices: 모두 읽기 가능, 관리자만 쓰기 가능
CREATE POLICY "Notices are viewable by everyone" ON notices
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage notices" ON notices
  FOR ALL USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Activity Logs: 관리자만 읽기 가능
CREATE POLICY "Only admins can view activity logs" ON activity_logs
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_industries_updated_at BEFORE UPDATE ON industries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_data_updated_at BEFORE UPDATE ON financial_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_documents_updated_at BEFORE UPDATE ON company_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 사용자 생성 시 프로필 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'fullName',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 샘플 데이터 삽입
INSERT INTO industries (name, description) VALUES
('IT/소프트웨어', '소프트웨어 개발, IT 서비스, 클라우드 컴퓨팅 등'),
('바이오/헬스케어', '제약, 의료기기, 헬스테크 등'),
('핀테크', '금융 기술, 결제 솔루션, 블록체인 등'),
('이커머스', '온라인 쇼핑몰, 마켓플레이스 등'),
('에너지/환경', '신재생에너지, 환경 기술 등'),
('제조업', '전자제품, 자동차 부품, 기계 장비 등'),
('서비스업', '교육, 컨설팅, 여행 등'),
('미디어/엔터테인먼트', '콘텐츠 제작, 스트리밍 서비스 등')
ON CONFLICT (name) DO NOTHING;