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
#ifndef OOX_FOOTNOTE_INCLUDE_H_
#define OOX_FOOTNOTE_INCLUDE_H_

#include "File.h"
#include "IFileContainer.h"
#include <vector>
#include "property.h"
#include "nullable_property.h"
#include "Logic/FootnoteReference.h"
#include "WritingElement.h"
#include "Logic/TextItem.h"
#include "Limit/SeparatorType.h"

namespace OOX
{
	class FootNote : public OOX::File, public IFileContainer
	{
	public:
		class Note : public WritingElement
		{
		public:
			Note();
			virtual ~Note();			
			explicit Note(const XML::XNode& node);
			const Note& operator =(const XML::XNode& node);

		public:
			virtual void fromXML(const XML::XNode& node);
			virtual const XML::XNode toXML() const;

		public:
			void push_back(const OOX::Logic::Paragraph& paragraph);

		public:
			nullable_property<std::string, Limit::SeparatorType> Type;
			property<size_t>	Id;
			property<std::vector<Logic::TextItem> >	Items; 	
		};

	public:
		FootNote();
		FootNote(const OOX::CPath& filename);
		virtual ~FootNote();

	public:
		virtual void read(const OOX::CPath& filename);
		virtual void write(const OOX::CPath& filename, const OOX::CPath& directory, ContentTypes::File& content) const;

	public:
		virtual const FileType type() const;
		virtual const OOX::CPath DefaultDirectory() const;
		virtual const OOX::CPath DefaultFileName() const;

	public:
		const FootNote::Note find(const Logic::FootnoteReference& reference) const;
		void add(const FootNote::Note& note);
		void push_back(const FootNote::Note& note);
		const size_t size() const;

	public:
		property<std::vector<Note> >  Notes;
	};
} 

#endif // OOX_FOOTNOTE_INCLUDE_H_