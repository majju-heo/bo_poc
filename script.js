class LaborContractAnalyzer {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.laborStandards = this.getKoreanLaborStandards();
    }

    initializeElements() {
        this.uploadSection = document.getElementById('uploadSection');
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.mainContainer = document.getElementById('mainContainer');
        this.documentContent = document.getElementById('documentContent');
        this.analysisContent = document.getElementById('analysisContent');
        this.highCount = document.getElementById('highCount');
        this.mediumCount = document.getElementById('mediumCount');
        this.lowCount = document.getElementById('lowCount');
    }

    bindEvents() {
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        
        // 모바일 터치 최적화
        this.uploadArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.fileInput.click();
        }, { passive: false });
        
        // 모바일에서 스크롤 개선
        if ('ontouchstart' in window) {
            document.addEventListener('touchmove', function(e) {
                if (e.target.closest('.analysis-view') || e.target.closest('.document-view')) {
                    return;
                }
                e.preventDefault();
            }, { passive: false });
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    async processFile(file) {
        // 실제로는 파일을 읽고 파싱해야 하지만, POC이므로 샘플 데이터 사용
        this.showMainContainer();
        this.displaySampleContract();
        this.analyzeContract();
    }

    showMainContainer() {
        this.uploadSection.style.display = 'none';
        this.mainContainer.style.display = 'block';
    }

    displaySampleContract() {
        // 샘플 근로계약서 내용
        const sampleContract = `
            <h2>근 로 계 약 서</h2>
            
            <div class="clause">
                <div class="clause-title">제1조 (계약기간)</div>
                <p>2024년 1월 1일부터 2024년 12월 31일까지로 한다.</p>
            </div>

            <div class="clause">
                <div class="clause-title">제2조 (근무장소)</div>
                <p>서울특별시 강남구 테헤란로 123, ○○빌딩 5층</p>
            </div>

            <div class="clause">
                <div class="clause-title">제3조 (업무내용)</div>
                <p>소프트웨어 개발 및 유지보수</p>
            </div>

            <div class="clause">
                <div class="clause-title">제4조 (근로시간)</div>
                <p>주 5일, 1일 8시간 근무를 원칙으로 한다. (09:00 ~ 18:00)</p>
            </div>

            <div class="clause">
                <div class="clause-title">제5조 (임금)</div>
                <p>기본급: 월 3,000,000원<br>
                지급일: 매월 25일<br>
                지급방법: 근로자 명의 계좌이체</p>
            </div>

            <div class="clause">
                <div class="clause-title">제6조 (연차유급휴가)</div>
                <p>연차유급휴가는 근로기준법에 따라 부여한다.</p>
            </div>

            <div class="clause">
                <div class="clause-title">제7조 (사회보험)</div>
                <p>4대 보험(국민연금, 건강보험, 고용보험, 산재보험)에 가입한다.</p>
            </div>

            <div class="clause">
                <div class="clause-title">제8조 (퇴직금)</div>
                <p>계속근로년수 1년에 대하여 30일분의 평균임금을 퇴직금으로 지급한다.</p>
            </div>
        `;

        this.documentContent.innerHTML = sampleContract;
    }

    analyzeContract() {
        const issues = this.performAnalysis();
        this.displayAnalysisResults(issues);
        this.updateSummary(issues);
    }

    performAnalysis() {
        // 고용노동부 기준에 따른 분석
        return [
            {
                severity: 'high',
                clause: '제1조 (계약기간)',
                issue: '계약기간이 1년으로 명시되어 있으나, 계약 갱신 조건이 명시되지 않음',
                reason: '기간제 근로계약의 경우 2년을 초과하면 무기계약으로 간주됩니다. 계약 갱신 여부와 조건을 명확히 해야 합니다.',
                suggestion: '본 계약 만료 시 회사와 근로자 간 합의에 따라 계약을 갱신할 수 있으며, 계약 갱신 여부는 만료 30일 전까지 서면으로 통보한다.'
            },
            {
                severity: 'high',
                clause: '제4조 (근로시간)',
                issue: '휴게시간이 명시되지 않음',
                reason: '근로기준법 제54조에 따라 4시간 근로 시 30분 이상, 8시간 근로 시 1시간 이상의 휴게시간을 근로시간 도중에 주어야 합니다.',
                suggestion: '근로시간은 09:00부터 18:00까지로 하며, 12:00부터 13:00까지 1시간의 휴게시간을 부여한다.'
            },
            {
                severity: 'medium',
                clause: '제5조 (임금)',
                issue: '연장근로수당, 야간근로수당, 휴일근로수당에 대한 언급이 없음',
                reason: '근로기준법에 따라 연장·야간·휴일 근로에 대해서는 통상임금의 50% 이상을 가산하여 지급해야 합니다.',
                suggestion: '연장근로, 야간근로, 휴일근로 시 근로기준법에서 정한 바에 따라 통상임금의 50% 이상을 가산하여 지급한다.'
            },
            {
                severity: 'medium',
                clause: '제6조 (연차유급휴가)',
                issue: '구체적인 연차 일수가 명시되지 않음',
                reason: '투명한 근로조건 제시를 위해 연차휴가 일수를 구체적으로 명시하는 것이 좋습니다.',
                suggestion: '1년간 80% 이상 출근한 근로자에게 15일의 유급휴가를 부여하며, 계속근로연수 1년을 초과하는 매 2년마다 1일을 가산한다.'
            },
            {
                severity: 'low',
                clause: '제3조 (업무내용)',
                issue: '업무 범위가 포괄적으로 기술됨',
                reason: '업무 내용을 구체적으로 명시하면 업무 범위에 대한 분쟁을 예방할 수 있습니다.',
                suggestion: '웹 애플리케이션 개발, 데이터베이스 설계 및 관리, 시스템 유지보수, 기술 문서 작성 등'
            },
            {
                severity: 'low',
                clause: '추가 필요 조항',
                issue: '수습기간에 대한 조항이 없음',
                reason: '수습기간을 명시하면 초기 근무 적응 기간 동안의 조건을 명확히 할 수 있습니다.',
                suggestion: '수습기간은 3개월로 하며, 수습기간 중 급여는 정식 급여의 100%를 지급한다.'
            }
        ];
    }

    displayAnalysisResults(issues) {
        this.analysisContent.innerHTML = '';
        
        issues.forEach(issue => {
            const item = document.createElement('div');
            item.className = 'analysis-item';
            
            item.innerHTML = `
                <div class="analysis-severity severity-${issue.severity}">
                    ${this.getSeverityLabel(issue.severity)}
                </div>
                <div class="analysis-clause">${issue.clause}</div>
                <div class="analysis-issue">${issue.issue}</div>
                <div class="analysis-reason">
                    <div class="reason-title">📌 검토 이유</div>
                    <div class="reason-text">${issue.reason}</div>
                </div>
                <div class="suggestion-box">
                    <div class="suggestion-title">✏️ 권장 수정안</div>
                    <div class="suggestion-text">${issue.suggestion}</div>
                </div>
            `;
            
            this.analysisContent.appendChild(item);
        });
    }

    updateSummary(issues) {
        const counts = {
            high: 0,
            medium: 0,
            low: 0
        };
        
        issues.forEach(issue => {
            counts[issue.severity]++;
        });
        
        this.highCount.textContent = counts.high;
        this.mediumCount.textContent = counts.medium;
        this.lowCount.textContent = counts.low;
    }

    getSeverityLabel(severity) {
        const labels = {
            high: '필수 수정',
            medium: '권장 수정',
            low: '검토 사항'
        };
        return labels[severity];
    }

    getKoreanLaborStandards() {
        return {
            minimumWage: 9860, // 2024년 최저시급
            standardWorkHours: 40, // 주 40시간
            overtimeRate: 1.5, // 연장근로 가산율
            annualLeave: {
                first: 15, // 첫해 연차
                increment: 1 // 2년마다 1일 추가
            },
            probationPeriod: 3, // 수습기간 3개월
            severancePay: 30 // 퇴직금 30일분
        };
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new LaborContractAnalyzer();
});