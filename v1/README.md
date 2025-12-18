# NTU Student Club Explorer

A comprehensive interactive platform for discovering and analyzing 113 student clubs across 6 categories at Nanyang Technological University (NTU). This tool empowers students to make informed decisions about their co-curricular involvement based on time commitment, physical demands, mental load, entry requirements, and CCA points.

## 🎯 Features

### Core Functionality
- **Interactive Club Cards**: Browse 113 clubs with detailed information
- **Advanced Filtering**: Search by name, category, and custom selections
- **Multi-Criteria Sorting**: Sort by time load, physical demands, mental load, entry criteria, CCA points, or alphabetically
- **Individual Club Selection**: Checkbox system to select specific clubs of interest
- **Selected Clubs View**: Filter to show only your selected clubs
- **Real-time Analytics**: Dynamic summary statistics based on current filters

### Analysis Capabilities
- **Executive Summary Table**: Comprehensive overview of all club metrics
- **Category Analysis**: Breakdown across 6 main categories
- **Pattern Recognition**: Identifies high-commitment clubs, beginner-friendly options, and hidden gems
- **Correlation Insights**: Statistical relationships between different club characteristics

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional UI**: Clean, modern interface with NTU branding
- **Smooth Animations**: Enhanced user experience with card animations and hover effects
- **Accessibility**: Keyboard navigation and screen reader support

## 📊 Club Categories

1. **Varsity Sports** (41 clubs) - Competitive athletic teams
2. **Academic & Professional Development** (41 clubs) - Career and skill-focused organizations
3. **Arts & Culture** (14 clubs) - Creative and cultural societies
4. **Community & Social Impact** (9 clubs) - Service-oriented clubs
5. **Student Governance** (4 clubs) - Leadership and governance roles
6. **Special Interest** (4 clubs) - Hobby and special interest groups

## 🏆 CCA Points System

### Key Assumptions for CCA Points Allocation

**For Varsity Sports:**
- **Band A & B Sports**: 7 CCA points
- **Band C Sports**: 5 CCA points  
- **Band D Sports**: 3 CCA points

**For Non-Varsity Clubs:**
- Points allocated based on HAS_AnnexA
- Range: 1-9 points depending on club type and involvement level

**Member Type Assumption:**
- All CCA points reflect **regular member** participation
- Leadership positions and executive committee roles would typically earn additional points
- Points may vary based on actual participation level and achievements
## 🔧 Technical Implementation

### Files Structure
```
NTU Clubs & Societies Explorer/
├── index.html          # Main HTML structure
├── script.js           # Interactive functionality and data processing
├── style.css           # Styling and responsive design
├── data.js             # Club data with all metrics
└── README.md           # This documentation file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for CDN resources)

### Installation
1. Clone or download the repository
2. Ensure all 4 files are in the same directory
3. Open `index.html` in a web browser
4. No build process or server required - it's a static website!

### Deployment Options

#### GitHub Pages (Recommended)
1. Upload files to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Access via `https://yourusername.github.io/repository-name/`

#### Other Hosting Platforms
- **Netlify**: Drag and drop deployment
- **Vercel**: Connect GitHub repository
- **GitHub Codespaces**: Development environment
- **Local Server**: Use any HTTP server for development

## 📈 Data Insights

### Key Statistics
- **113 Total Clubs** across 6 categories
- **Average Time Commitment**: 8.4 hours/week
- **Physical Load Average**: 4.5/10
- **Mental Load Average**: 6.8/10
- **Entry Criteria Average**: 5.0/10

### Notable Patterns
- **High-Commitment Clubs**: 16 clubs requiring 15+ hours/week
- **Triple Threat Clubs**: 13 clubs with high physical, mental, and entry requirements
- **Beginner-Friendly**: 31 clubs with low barriers to entry
- **Hidden Gems**: 7 clubs offering high mental rewards with low entry requirements

### Strong Correlations
- **Time ↔ Entry Criteria**: 0.83 correlation
- **Time ↔ Mental Load**: 0.72 correlation  
- **Mental ↔ Entry Criteria**: 0.78 correlation
- **Physical ↔ Entry Criteria**: 0.62 correlation

## 🎨 Customization

### Adding New Clubs
1. Edit `data.js`
2. Add new club object with required fields:
   ```javascript
   {
       name: "Club Name",
       ccaPoints: 5,
       category: "Category Name",
       timeLoad: { text: "Description", value: 8 },
       physicalLoad: { score: 6, justification: "Reason" },
       mentalLoad: { score: 7, justification: "Reason" },
       entryCriteria: { score: 4, justification: "Reason" },
       description: "Club description"
   }
   ```

### Styling Modifications
- Edit `style.css` for visual changes
- Color scheme uses CSS custom properties (variables)
- Responsive breakpoints defined for mobile optimization

### Feature Extensions
- Additional filter criteria can be added in `script.js`
- New metrics can be incorporated by extending the data structure
- Export functionality can be added for selected clubs

## 🤝 Contributing

### Data Accuracy
- Club information is based on publicly available data
- CCA points are estimated based on institutional guidelines
- Time commitments reflect typical member experience

### Reporting Issues
- Data corrections welcome
- Feature suggestions appreciated
- UI/UX improvements encouraged

### Development Guidelines
- Follow existing code style and structure
- Test across different browsers and devices
- Maintain accessibility standards
- Document any new features or assumptions

## 📄 License

This project is created for educational and informational purposes. Club data is compiled from publicly available sources. For official club information and CCA point allocations, please consult NTU's official resources.


## 📞 Contact

For questions, suggestions, or corrections:
- Create an issue in the GitHub repository
- Contact the development team
- Refer to NTU official channels for authoritative club information

---

**Disclaimer**
All information, including CCA descriptions and point allocations, is collated from publicly available sources—for example, the NTU Student Affairs Office website, official club materials, and community discussions on third-party platforms such as Reddit. Although reasonable efforts were made to cross-check details, no guarantee is given regarding the accuracy, completeness, or current validity of the content. Policies, point schemes, and club statuses can change without notice.
This document is informational only and should not be treated as an official statement of NTU rules or requirements. Users remain fully responsible for confirming any critical data directly with the relevant CCA committees, the Student Affairs Office, or other authorised university channels before relying on it for hall admission, scholarship, or academic planning decisions.
By using this document, you acknowledge and agree that the author(s) and contributors accept no liability for losses or consequences arising from reliance on the material provided.

**免责声明**
所有信息，包括课外活动（CCA）的描述及积分分配，均整理自公开可获取的来源，例如新加坡南洋理工大学（NTU）学生事务处网站、官方社团资料及Reddit等第三方平台上的社区讨论。尽管已尽合理努力对相关细节进行交叉核验，但对于本文件所述内容的准确性、完整性或现行有效性，均不做任何保证。相关政策、积分制度及社团状态均可能在未经通知的情况下发生变更。
本文件仅为信息参考之目的，不得被视为新加坡南洋理工大学（NTU）规则或要求的官方声明。用户在依据本文件作出宿舍申请、奖学金申请或学术规划等决策前，应自行向相关课外活动（CCA）委员会、学生事务处或其他学校授权渠道直接核实所有关键信息，并对此承担全部责任。
凡使用本文件者，即视为其确认并同意，作者及贡献者不对因依赖本文件所提供的材料而产生的任何损失或后果承担责任。

**Last Updated**: July 2025
**Version**: 2.0 (with CCA points and individual selection features)
