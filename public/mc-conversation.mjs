// Original conversational scripts. Facts and live numbers are filled separately.
export const conversationScenes={
 roomWelcome:[
  'Chào cả nhà vừa ghé vào! Bạn quê ở đâu, để lại tên tỉnh dưới bình luận nhé. Chỉ một bình luận thôi là quê mình có đèn trên bản đồ, không cần tặng quà đâu.',
  'Có ai đang xem mà quê mình còn chưa sáng không? Bình luận tên tỉnh nhé, mình cùng mở đèn cho quê bạn. Biết đâu trong phòng đang có người cùng quê chờ bạn lên tiếng đấy.',
  'Hôm nay cả nhà mình đang ở quê hay đi làm xa? Trước tiên cứ bình luận tên tỉnh để thắp sáng quê mình đã nhé. Rồi kể một món quê mà lâu lắm bạn chưa được ăn xem nào.',
  'Mời những bạn mới vào cùng chơi nhé. Bình luận tên tỉnh, có dấu hay không dấu đều được. Khi quê mình sáng lên, ai cùng quê nhớ chào nhau một tiếng, gặp được đồng hương là vui rồi.',
  'Bạn nhìn thấy quê mình trên bản đồ chưa? Để lại tên tỉnh dưới bình luận nhé. Hôm nay mình cùng tìm đồng hương, nghe chuyện quê và xem quê nào về đích trước.',
  'Chào bạn đang nghe ở đầu bên kia nhé! Bạn đang ở miền nào, bình luận tên tỉnh để cả phòng biết với nào. Quê mình chưa có đèn thì bạn mở màn luôn nhé.',
  'Ai vừa vào chưa biết chơi thì rất đơn giản thôi: bình luận tên tỉnh để thắp sáng, mỗi bình luận hợp lệ góp một điểm. Mời bạn chọn quê cùng cả nhà nhé!',
  'Có đồng hương nào lâu rồi chưa về nhà không? Hôm nay mình hẹn nhau trên bản đồ trước nhé. Bạn bình luận tên tỉnh, để xem hội quê mình có những ai nào.'
 ],
 firstLight:[
  'Sáng rồi, {province} lên đèn rồi cả nhà! Cảm ơn {name} mở màn cho quê mình. Đồng hương {province} đang xem, bình luận tên tỉnh để vào cùng bạn nhé.',
  'Đón được {name} ở {province} rồi nhé! Ánh đèn đầu tiên đã có, bây giờ mình cùng chờ hội đồng hương về đông hơn. Ai cùng quê, để lại tên tỉnh nào.',
  '{province} có đèn rồi! Người mở đầu là {name}, cảm ơn bạn nhé. Một bình luận mà đưa cả quê mình lên bản đồ, vui thế này thì đồng hương vào tiếp sức thôi.',
  'Chào {name}, chào đồng hương {province}! Quê mình vừa có ánh đèn đầu tiên trong vòng này. Ai còn đang xem, bình luận tên tỉnh để góp thêm một điểm nhé.'
 ],
 comment:[
  '{province} lên {score} điểm rồi nhé. Cảm ơn {name} vừa góp thêm {points} điểm, đồng hương mình vẫn đang giữ nhịp rất đều!',
  'Có thêm {name} tiếp sức cho {province}! Tổng hiện tại là {score} điểm. Quê mình còn ai đang xem, vào cùng hội nào.',
  'Thêm {points} điểm từ bình luận của {name}, {province} đang có {score} điểm rồi. Cứ từng người góp một chút, thứ hạng có thể đổi lúc nào đấy!'
 ],
 giftQuick:[
  'Nhận được quà rồi, {name} ơi! Cảm ơn bạn đã tiếp sức cho {province}.',
  'Cảm ơn {name} nhé! Món quà vừa cộng thêm {points} điểm cho {province}, đồng hương mình cùng cổ vũ nào.',
  '{province} nhận thêm {points} điểm rồi! Cảm ơn {name} đã gửi quà về quê mình nhé.',
  'Quà của {name} đã tới {province}! Thêm {points} điểm cho quê nhà, cảm ơn tình cảm của bạn nhé.'
 ],
 progress:[
  'Mình điểm lại một chút nhé: {lit} trên {total} tỉnh đã sáng, có {people} người góp mặt trong vòng này. Bạn vừa vào thì bình luận tên tỉnh để tham gia, mình vẫn đang chờ thêm đồng hương ở những quê còn tối.',
  'Bản đồ đã có {lit} tỉnh sáng rồi cả nhà, còn {dark} tỉnh chưa mở đèn. Ai muốn làm người đầu tiên cho quê mình, bình luận tên tỉnh nhé. Không cần quà, một bình luận là tham gia được ngay.',
  'Đến lúc này có {people} người cùng thắp sáng {lit} tỉnh. Cảm ơn cả nhà đã mang quê mình tới đây. Bạn nhìn xem đã thấy đồng hương chưa, nếu thấy rồi thì chào nhau một câu nhé.'
 ],
 chase:[
  'Cả nhà nhìn cuộc đua này nhé, {province} chỉ cần thêm {needed} điểm là vượt mức hiện tại của {target}. Đồng hương hai quê đang xem, bình luận tên tỉnh để tiếp sức nào. Chưa hết giờ thì chưa biết ai thắng đâu!',
  '{province} đang bám ngay sau {target}, thêm {needed} điểm nữa là đổi chỗ rồi. Mỗi bình luận hợp lệ góp một điểm, quê mình có kịp bứt lên không? Mình cùng chờ nhé!',
  'Cơ hội đang ở ngay trước mắt {province}: cần {needed} điểm nữa để vượt {target}. Ai cùng quê mà vẫn đang xem, vào tiếp sức một bình luận nhé. Cuộc đua còn nhiều bất ngờ lắm.'
 ],
 leader:[
  'Đổi ngôi rồi cả nhà! {province} vừa lên đầu với {score} điểm. Chúc mừng đồng hương, nhưng mình còn phải giữ nhịp nhé, các quê phía sau vẫn đang đuổi rất sát.',
  '{province} đang dẫn đầu, {score} điểm rồi nhé! Quê nào muốn đuổi kịp, đồng hương cùng bình luận tên tỉnh để tiếp sức. Mình chờ xem ngôi đầu này giữ được bao lâu nào.'
 ],
 idle:[
  'Phòng mình đang chờ thêm đồng hương đây. Bạn quê ở tỉnh nào, bình luận tên tỉnh để thắp sáng nhé. Không cần quà, cứ tham gia cùng cả nhà cho vui!',
  'Ai còn đang xem mà chưa tham gia, thử bình luận tên tỉnh của bạn nhé. Thấy quê mình có đèn rồi thì gọi thêm đồng hương vào cùng, mỗi bình luận hợp lệ đều góp một điểm.',
  'Mình đang tìm những ánh đèn mới trên bản đồ. Bạn có muốn quê mình xuất hiện không? Bình luận tên tỉnh nhé, rồi cùng kể một chút về nơi bạn sinh ra nào.'
 ],
 hometownFeeling:[
  'Cả nhà thử nhớ xem, mỗi lần về quê thì món đầu tiên bạn muốn ăn là gì? Có khi là bát canh mẹ nấu, có khi chỉ là quán ăn đầu ngõ mà ở thành phố tìm mãi chẳng thấy đúng vị. Bạn kể tên món ấy dưới bình luận nhé, để xem có ai nhận ra quê của bạn không. Còn muốn thắp sáng trên bản đồ thì bình luận riêng tên tỉnh nhé.',
  'Ai đang đi làm xa, lần gần nhất bạn về nhà là khi nào? Có người mới về tuần trước, cũng có người vẫn đang chờ sắp xếp được một chuyến. Chưa về được thì hôm nay mình gặp đồng hương ở đây trước nhé. Bình luận tên tỉnh để thắp sáng quê mình, rồi kể xem điều gì làm bạn nhớ nhà nhất vào những ngày đi xa.',
  'Nếu được dẫn cả phòng về quê một ngày, bạn sẽ đưa mọi người đi đâu trước? Một bãi biển, một phiên chợ, hay con đường tới trường ngày bé? Những nơi quen với mình có khi lại rất thú vị với người chưa từng đến. Bạn giới thiệu một chỗ dưới bình luận nhé, biết đâu lại có đồng hương nhận ra và kể tiếp cùng bạn.',
  'Có ai xa quê rồi mới thấy quý giọng nói quê mình không? Đang ở một nơi đông người, bất chợt nghe một câu nói quen là muốn quay lại hỏi ngay: bạn cũng cùng quê à? Hôm nay trong phòng này biết đâu cũng có một cuộc gặp như thế. Cả nhà bình luận tên tỉnh để tìm nhau nhé, gặp đồng hương thì nhớ chào nhau một tiếng.',
  'Bạn có nhớ buổi sáng ở quê mình thường bắt đầu bằng tiếng gì không? Tiếng chợ, tiếng gọi nhau đầu ngõ, hay tiếng xe đi qua con đường quen? Mỗi nơi một khác, nhưng nghe đúng âm thanh ấy là nhận ra nhà mình ngay. Ai đang ở quê kể cho những người đi xa nghe một chút nhé, để cả phòng cùng hình dung quê bạn.',
  'Cả nhà có ai còn giữ một nhóm bạn từ hồi đi học không? Mỗi người đi một nơi, lâu lâu hẹn được một bữa ở quê là chuyện cũ lại kể mãi không hết. Nếu hôm nay thấy tên tỉnh mình sáng trên bản đồ, thử chào đồng hương xem nhé. Biết đâu lại gặp người từng học gần trường mình, từng đi chung một con đường mỗi sáng.',
  'Nhìn một tỉnh trên bản đồ thì chỉ thấy tên và đường ranh, nhưng với người cùng quê đó còn là nhà, là người thân, là bao nhiêu chuyện để nhớ. Bởi thế mình mới rủ cả nhà thắp sáng quê hương cùng nhau. Bạn vừa vào phòng thì bình luận tên tỉnh nhé, rồi kể một điều bình dị mà bạn thích nhất ở nơi mình lớn lên.',
  'Quê mình không nhất thiết phải có một địa điểm thật nổi tiếng mới đáng giới thiệu đâu cả nhà. Một bến nước, một con ngõ, một quán nhỏ quen thuộc cũng có thể là nơi mình muốn dẫn bạn bè về nhất. Bạn muốn giới thiệu điều gì về quê mình? Kể ở bình luận nhé, còn tên tỉnh thì gửi riêng để hệ thống nhận và thắp đèn cho đúng.'
 ],
 hometownVisit:[
  'Cảm ơn bông hồng của {name} nhé! Nhờ bạn mà cả phòng có dịp ghé thăm {province}. {intro} Đồng hương quê mình còn biết chỗ nào hay, kể thêm cho cả nhà nghe nhé.',
  'Mình nhận được hoa hồng của {name} rồi! Bây giờ mời cả nhà cùng về {province}. {intro} Ai đã từng đến đây, chia sẻ một kỷ niệm cùng đồng hương nhé.',
  'Một bông hồng gửi về {province}, cảm ơn {name}! Mình cùng ngắm quê bạn một chút nhé. {intro} Có đồng hương nào đang ở quê không, chào cả phòng một tiếng nào.'
 ],
 winnerVisit:[
  'Chúc mừng đồng hương {province}! Trước khi xem clip, mình cùng ghé quê chiến thắng một chút nhé. {intro} Mời cả nhà cùng theo dõi, và cảm ơn những người vừa tiếp sức cho quê mình.',
  'Vòng này mình có hẹn về {province} rồi cả nhà! {intro} Đồng hương quê mình cùng đón mọi người nhé, chuyến về thăm quê bắt đầu ngay sau đây.'
 ],
 next:['Mình chuẩn bị vòng mới nhé cả nhà. Đèn và điểm được đặt lại, ai cũng có cơ hội mở màn cho quê mình. Cứ bình luận tên tỉnh khi đếm ngược kết thúc nhé!']
};
