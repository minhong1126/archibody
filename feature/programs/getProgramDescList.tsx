const getProgramDescList = () => {
  return [
    {
      index: '01',
      title: ['몸건축 워크샵', '원주 오픈하우스'],
      href: '',
      accent: 'from-red-600/5',
      rows: [
        { label: '대상', value: '예비 건축주 또는 건축에 관심 있는 누구나' },
        {
          label: '방식',
          value: (
            <>
              원주 &apos;<span className="text-neutral-700">ㄷ자 집</span>
              &apos;에서 집짓는 이야기
              <br className="lg:hidden" /> &apos;
              <span className="text-neutral-700">ㄷ자 집</span>&apos;과 이웃집
              돌아보기
            </>
          ),
        },
        { label: '기간', value: '연간 6회' },
        {
          label: '신청',
          value: (
            <>
              전화 • 문자 • 이메일 신청
              <span className="text-neutral-500">(회별 최대 5팀)</span>
            </>
          ),
        },
      ],
    },
    {
      index: '02',
      title: ['신규 프로젝트', '오픈하우스'],
      href: '/program/newProject',
      accent: 'from-violet-700/5',
      rows: [
        {
          label: '대상',
          value: (
            <>
              <span className="lg:text-zinc-800">고성능 주택</span> (SIP, 목조,
              고단열)을 직접 체험하고 싶은 누구나
            </>
          ),
        },
        { label: '방식', value: '최신 프로젝트 집 구경 (둘러보기)' },
        { label: '기간', value: '준공 시 입주 전, 해당 기간에 별도 공지' },
        {
          label: '신청',
          value: (
            <>
              전화 • 문자 • 이메일 신청 후 일정 확인
              <span className="text-neutral-500">(회별 최대 3팀)</span>
            </>
          ),
        },
      ],
    },
    {
      index: '03',
      title: ['찾아가는', ' 건축상담'],
      href: '/program/consulting',
      accent: 'from-sky-500/5',
      rows: [
        {
          label: '대상',
          value:
            '실제 집 짓기를 계획하고 계신 예비 건축주, 또는 건축에 관심있는 누구나',
        },
        {
          label: '방식',
          value:
            "원주 'ㄷ자 집'으로 내방 / 건축사가 대지 또는 후보지를 직접 방문하여 상담",
        },
        { label: '기간', value: '수시' },
        {
          label: '신청',
          value: '전화 • 문자 • 이메일 신청 후 방문 장소, 시간 협의',
        },
      ],
    },
  ];
};

export default getProgramDescList;
