// Rewrite narrator self-identification in template source, before viewer-name
// placeholders are expanded. A viewer called Mai Trường keeps their name.
export function anonymousNarration(text){return text
 .replaceAll('Mai Trường chào','Chào')
 .replaceAll('Mai Trường đang chờ','Mình đang chờ')
 .replaceAll('Mai Trường xin gọi tên','Xin gọi tên')
 .replaceAll('Mai Trường gửi lời chào','Gửi lời chào')
 .replaceAll('Mai Trường xin chào','Xin chào')
 .replaceAll('theo dõi Mai Trường','theo dõi phòng LIVE')
 .replaceAll('Mai Trường mời cả nhà','Mời cả nhà')
 .replaceAll('lời MC sẽ lần lượt gửi','lời chào sẽ lần lượt gửi')
 .replaceAll('gọi tên quê hương','bình luận tên tỉnh để thắp sáng quê hương')
 .replaceAll('gọi tên quê mình','bình luận tên tỉnh để thắp sáng quê mình')
 .replaceAll('gọi tên quê','bình luận tên tỉnh')
 .replaceAll('lời gọi quê','bình luận thắp sáng quê');}
