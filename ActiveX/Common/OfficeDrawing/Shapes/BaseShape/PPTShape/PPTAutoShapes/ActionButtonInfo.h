﻿/*
 * (c) Copyright Ascensio System SIA 2010-2014
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 #pragma once
#include "../PPTShape.h"


class CActionButtonInfoType : public CPPTShape
{
public:
	CActionButtonInfoType()

    {
        m_bConcentricFill = true;
		m_eJoin = NSOfficeDrawing::lineJoinMiter;
        
		m_strPath = _T("m,l,21600r21600,l21600,xem@0@0nfl@0@2@1@2@1@0xem,nfl@0@0em,21600nfl@0@2em21600,21600nfl@1@2em21600,nfl@1@0em@3@9nfqx@11@4@3@10@12@4@3@9xem@3@25nfqx@33@26@3@27@36@26@3@25xem@32@28nfl@32@29@34@29@34@30@32@30@32@31@37@31@37@30@35@30@35@28xe");

		AddGuide(_T("val #0")); 
		AddGuide(_T("sum width 0 #0"));  
		AddGuide(_T("sum height 0 #0"));  
		AddGuide(_T("prod width 1 2"));  
		AddGuide(_T("prod height 1 2"));  
		AddGuide(_T("prod #0 1 2"));  
		AddGuide(_T("prod #0 3 2"));  
		AddGuide(_T("sum @1 @5 0")); 
		AddGuide(_T("sum @2 @5 0")); 
		AddGuide(_T("sum @0 @4 8100"));  
		AddGuide(_T("sum @2 8100 @4"));  
		AddGuide(_T("sum @0 @3 8100"));
		AddGuide(_T("sum @1 8100 @3"));
		AddGuide(_T("sum @10 0 @9"));  
		AddGuide(_T("prod @13 1 32"));  
		AddGuide(_T("prod @13 5 32"));  
		AddGuide(_T("prod @13 9 32"));  
		AddGuide(_T("prod @13 5 16"));  
		AddGuide(_T("prod @13 3 8"));  
		AddGuide(_T("prod @13 13 32"));  
		AddGuide(_T("prod @13 19 32"));  
		AddGuide(_T("prod @13 5 8"));  
		AddGuide(_T("prod @13 11 16"));  
		AddGuide(_T("prod @13 13 16"));  
		AddGuide(_T("prod @13 7 8"));  
		AddGuide(_T("sum @9 @14 0"));  
		AddGuide(_T("sum @9 @15 0"));  
		AddGuide(_T("sum @9 @16 0"));  
		AddGuide(_T("sum @9 @17 0"));  
		AddGuide(_T("sum @9 @18 0")); 
		AddGuide(_T("sum @9 @23 0"));  
		AddGuide(_T("sum @9 @24 0"));  
		AddGuide(_T("sum @11 @17 0"));  
		AddGuide(_T("sum @11 @18 0"));
		AddGuide(_T("sum @11 @19 0"));  
		AddGuide(_T("sum @11 @20 0"));  
		AddGuide(_T("sum @11 @21 0")); 
		AddGuide(_T("sum @11 @22 0"));  
		AddGuide(_T("sum @3 @5 0"));  
		AddGuide(_T("sum @4 @5 0"));  
		AddGuide(_T("sum @9 @5 0"));  
		AddGuide(_T("sum @10 @5 0"));  
		AddGuide(_T("sum @11 @5 0")); 
		AddGuide(_T("sum @12 @5 0"));  
		AddGuide(_T("sum @25 @5 0"));  
		AddGuide(_T("sum @26 @5 0")); 
		AddGuide(_T("sum @27 @5 0"));  
		AddGuide(_T("sum @28 @5 0"));  
		AddGuide(_T("sum @29 @5 0"));  
		AddGuide(_T("sum @30 @5 0"));  
		AddGuide(_T("sum @31 @5 0")); 
		AddGuide(_T("sum @32 @5 0"));  
		AddGuide(_T("sum @33 @5 0"));  
		AddGuide(_T("sum @34 @5 0"));  
		AddGuide(_T("sum @35 @5 0"));  
		AddGuide(_T("sum @36 @5 0"));  
		AddGuide(_T("sum @37 @5 0"));
		
		m_arAdjustments.Add(1350);
		LoadConnectorsList(_T("0,@4;@0,@4;@3,21600;@3,@2;21600,@4;@1,@4;@3,0;@3,@0"));
		LoadTextRect(_T("@0,@0,@1,@2"));

		CHandle_ oHandle1;
		oHandle1.position = _T("#0,topLeft");
		oHandle1.switchHandle = _T("true");
		oHandle1.xrange = _T("0,5400");
		m_arHandles.Add(oHandle1);

		m_lLimoX = 10800;
		m_lLimoY = 10800;
    }
};