export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-primary mb-4">404</p>
        <h1 className="text-xl font-bold mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-muted mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/"
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition text-sm"
          >
            홈으로 가기
          </a>
          <a
            href="/generate"
            className="px-6 py-2.5 border border-border rounded-lg font-semibold hover:bg-card transition text-sm"
          >
            카피 생성하기
          </a>
        </div>
      </div>
    </div>
  );
}
