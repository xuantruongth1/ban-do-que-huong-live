// Original scripts: invite viewers home, never invent viewers, gifts or scores.
export const mcScenes={
 roomWelcome:{label:'Phòng vắng / chào người xem',lines:[
 'Mai Trường chào cả nhà! Bạn đang nhớ quê nào, gõ tên tỉnh để lát nữa cùng thắp một ánh đèn nhé.',
 'Ai vừa ghé qua, mời ở lại một chút! Ở đây mình gọi tên quê hương và tìm những người đồng hương.',
 'Chào bạn đang xem! Có thể mình đang ở xa nhau, nhưng chỉ cần gọi tên quê là đã thấy gần nhau hơn rồi.',
 'Bạn đang ở quê hay đi làm xa? Cứ bình luận tên tỉnh, mình cùng đưa quê nhà lên bản đồ nhé.',
 'Cả nhà ơi, không cần quà để tham gia. Khi vòng đua mở, một bình luận đúng tên tỉnh cũng góp ánh đèn cho quê mình.',
 'Mỗi miền quê đều có một câu chuyện đáng nhớ. Hôm nay, bạn muốn cả phòng cùng về thăm quê nào?',
 'Người miền núi, miền biển hay miền sông nước đều có chung một nơi để nhớ. Mời bạn gọi tên quê mình nào!',
 'Mai Trường đang chờ lời điểm danh của cả nhà. Tên tỉnh có dấu hay không dấu đều được, miễn đúng quê bạn muốn chọn nhé.'
 ]},
 progress:{label:'Tổng kết người và tỉnh đang sáng',lines:[
 'Cả nhà nhìn bản đồ nhé: {lit} trên {total} tỉnh đã sáng, có {people} đồng hương tham gia vòng này rồi!',
 'Chúng ta đã cùng thắp {lit} tỉnh. {dark} quê còn chờ ánh đèn đầu tiên, ai muốn mở lời cho quê mình nào?',
 'Mỗi ánh đèn là một lời gọi quê. Đến lúc này có {people} người góp mặt và {lit} tỉnh đã bừng sáng.',
 'Bản đồ đang ấm lên từng chút: {lit} tỉnh sáng rồi cả nhà ơi! Mời những đồng hương còn đang xem cùng điểm danh.',
 'Đã sáng {lit} trên {total} quê hương. Điểm số là niềm vui, còn gặp được đồng hương mới là điều mình muốn giữ lại.',
 'Cảm ơn {people} đồng hương đã góp lời trong vòng này. {lit} tỉnh đang sáng, quê bạn đã có ánh đèn chưa?'
 ]},
 chase:{label:'Còn bao nhiêu điểm để vượt tỉnh phía trên',lines:[
 '{province} đang bám sát {target}! Cần thêm {needed} điểm để vượt lên, đồng hương mình cùng tiếp sức nhé.',
 'Chỉ cần kiếm thêm {needed} điểm, {province} sẽ vượt mốc hiện tại của {target}. Mỗi bình luận của quê mình đều có ý nghĩa!',
 'Khoảng cách đang rất gần: {province} cần {needed} điểm nữa để đứng trên {target} theo điểm hiện tại. Quê mình cùng giữ nhịp nào!',
 'Đồng hương {province} ơi, phía trước là {target}. Thêm {needed} điểm sẽ tạo cơ hội đổi thứ hạng, cả nhà cùng gọi tên quê nhé.',
 '{target} đang ở phía trên, nhưng {province} chỉ cần thêm {needed} điểm để vượt mốc hiện tại. Hai quê cùng thi đua vui vẻ nhé.',
 'Một nhịp tiếp sức nữa thôi: khoảng cần vượt của {province} lúc này là {needed} điểm trước {target}!'
 ]},
 unlitInvite:{label:'Mời quê chưa có ánh đèn',lines:[
 '{province} vẫn đang chờ lời điểm danh đầu tiên trong vòng này. Đồng hương quê mình đâu rồi?',
 'Mình thử tìm đồng hương {province} nhé! Một bình luận đúng tên tỉnh là quê mình có ánh đèn ngay.',
 'Có ai muốn mở đèn cho {province} không? Cả phòng đang chờ được nhìn thấy quê bạn trên bản đồ.',
 'Một lời gọi {province}, một chấm sáng quê nhà. Người con của quê mình vào điểm danh nào!',
 'Quê nào cũng xứng đáng được nhắc tên. {province} ơi, mời đồng hương gửi lời chào tới cả phòng.',
 'Mai Trường xin gọi tên {province}! Nếu đang xem, bạn bình luận tên quê để mình cùng mở ánh đèn đầu tiên nhé.'
 ]},
 homeJoin:{label:'Thêm người cùng quê',lines:[
 'Chào {name}, quê {province} có thêm một đồng hương rồi! Cùng giữ ánh đèn quê mình nhé.',
 '{name} vừa về cùng hội đồng hương {province}. Một lời điểm danh thôi mà thấy quê gần thêm một chút!',
 'Đồng hương {province} đón {name} nào! Quê mình lại có thêm người góp lời.',
 'Cảm ơn {name} đã gọi tên {province}. Gặp được nhau trong phòng LIVE cũng là một cuộc hẹn với quê nhà.',
 '{province} có thêm bạn đồng hành là {name}. Cả nhà cùng tiếp sức và chào nhau một câu nhé.'
 ]},
 switchedHome:{label:'Người chơi đổi quê chủ động',lines:[
 '{name} vừa chọn về {province}. Mình ghi nhận quê bạn chủ động chọn từ bình luận này nhé.',
 'Đã nhận lựa chọn mới của {name}: {province}! Điểm vừa góp sẽ về đúng quê đang chọn.',
 'Mời {name} về cùng đồng hương {province}. Những điểm cũ vẫn được giữ ở quê đã nhận trước đó nhé.'
 ]},
 comeback:{label:'Đồng hương quay lại tiếp sức',lines:[
 '{province} lại có lời điểm danh sau một lúc chờ rồi! Cảm ơn {name} đã quay lại giữ đèn quê mình.',
 'Quê {province} vừa được tiếp thêm một nhịp từ {name}. Người xa quê gặp lại nhau, câu chào nào cũng quý.',
 '{name} trở lại cùng {province}! Mình cùng nối tiếp câu chuyện quê hương nhé.'
 ]},
 soloHome:{label:'Mới có một tỉnh tham gia',lines:[
 '{province} đang mở đầu cuộc hội ngộ. Những quê khác ơi, vào cùng cho bản đồ thêm sắc màu nào!',
 'Ánh đèn của {province} đã có bạn giữ rồi. Mời đồng hương các tỉnh khác cùng mở lời cho quê mình.',
 'Hiện mới có {province} sáng đèn. Bạn muốn quê mình cùng xuất hiện không? Bình luận tên tỉnh nhé.',
 '{province} đã khởi động câu chuyện đầu tiên. Cả nhà cùng kể tiếp bằng tên quê của mình nào!'
 ]},
 allLit:{label:'Đủ tất cả tỉnh sáng',lines:[
 'Tất cả {total} tỉnh đều đã có ánh đèn! Cảm ơn cả nhà đã cùng làm nên một bản đồ đầy tình quê.',
 'Không còn quê nào tối nữa rồi! {total} tỉnh cùng sáng, mỗi đồng hương đều góp một phần vào khoảnh khắc này.',
 'Bản đồ đã sáng đủ {total} tỉnh. Mình cùng giữ ánh đèn và gửi một lời chúc bình an về khắp mọi miền nhé.',
 'Cả đất nước đã bừng sáng trong vòng này! Dù bạn chọn quê nào, chúng ta vẫn đang cùng chung một cuộc hội ngộ.'
 ]},
 hometownFeeling:{label:'Gợi nhớ quê nhà',lines:[
 'Có khi nhớ quê chỉ là nhớ một bữa cơm, một con đường hay giọng nói của người thân. Bạn đang nhớ điều gì nhất?',
 'Đi xa rồi mới thấy, nghe ai gọi đúng tên quê mình cũng đủ ấm lòng. Cả nhà cùng gọi tên quê nhé.',
 'Tên tỉnh trên bản đồ không chỉ là địa danh, mà còn là nơi có bao người mình thương đang chờ.',
 'Một lời điểm danh là một lời nhắn về nhà. Mình cùng giữ không khí vui vẻ cho đồng hương khắp mọi miền nhé.',
 'Bạn chưa cần biết ai trong phòng này. Cứ gọi tên quê, biết đâu lại gặp một người nói cùng giọng với mình.',
 'Quê hương của mỗi người có thể khác nhau, nhưng tình cảm hướng về nhà thì mình hiểu nhau rất dễ.',
 'Cảm ơn cả nhà đã dành một chút thời gian cho quê hương. Chúc ai đang xa nhà cũng sớm có một chuyến trở về.',
 'Nếu hôm nay gặp được đồng hương ở đây, mời bạn gửi họ một câu chào thật ấm nhé.'
 ]},
 rankingUpdate:{label:'Nhắc thứ hạng đang diễn ra',lines:[
 '{province} đang dẫn với {score} điểm. Cảm ơn đồng hương đã cùng giữ nhịp; các quê còn lại vẫn đang tiến lên!',
 'Cập nhật cuộc đua: {province} có {score} điểm ở vị trí đầu. Cả nhà cứ tiếp sức cho quê mình và cổ vũ nhau nhé.',
 'Ngôi đầu hiện thuộc về {province}, {score} điểm. Những lời điểm danh tiếp theo có thể làm bản đồ đổi nhịp đó cả nhà.',
 '{province} đang ở phía trước với {score} điểm. Dẫn đầu là niềm vui, được cả phòng cùng nhìn thấy quê mình cũng rất đáng quý.'
 ]},
 underdog:{label:'Động viên quê ít điểm',lines:[
 '{province} đang có {score} điểm. Quê mình ít người cũng không sao, mỗi lời điểm danh vẫn làm ánh đèn thêm ấm!',
 'Mai Trường gửi lời chào tới đồng hương {province}. Mình đang có {score} điểm, cứ vui vẻ góp từng chút nhé.',
 'Có những quê tham gia thật lặng lẽ mà vẫn rất đáng yêu. {province} ơi, cả phòng vẫn nhìn thấy ánh đèn của mình!',
 'Đồng hương {province} đừng ngại số điểm hiện tại nhé. Được gọi tên quê mình đã là một niềm vui rồi.'
 ]},
 homeCrowd:{label:'Đếm người cùng quê',lines:[
 '{province} đã có {count} đồng hương góp mặt trong vòng này. Cả nhà cùng gửi một câu chào tới quê mình nhé!',
 'Hội đồng hương {province} đang có {count} người. Biết đâu bạn vừa tìm được một người cùng xóm trong phòng này!',
 '{count} người đang chung một lời gọi {province}. Cảm ơn quê mình đã cùng hội tụ!',
 'Mai Trường xin chào {count} đồng hương {province}! Chúc cả hội có một cuộc đua vui và một buổi gặp gỡ ấm áp.'
 ]},
 roomBusy:{label:'Phòng đang nhiều tương tác',lines:[
 'Nhiều quê đang cùng điểm danh quá! Mình vẫn ghi nhận điểm, lời MC sẽ lần lượt gửi tới cả nhà nhé.',
 'Bản đồ đang rộn ràng lời gọi quê. Cảm ơn đồng hương đã cùng giữ không khí vui vẻ cho cả phòng!',
 'Nhìn các tỉnh lần lượt sáng lên thấy ấm lòng thật! Cảm ơn mỗi người đã góp một lời cho quê nhà.'
 ]},
 viewerWelcome:{label:'Chào người thật vừa vào LIVE',lines:[
 'Mai Trường chào {name}! Bạn muốn thắp đèn cho quê nào, bình luận tên tỉnh nhé.',
 'Chào {name} vừa ghé chơi! Mời bạn ở lại cùng tìm đồng hương và gọi tên quê mình.',
 'Mừng {name} đến với cuộc hội ngộ quê hương. Một lời điểm danh đúng tên tỉnh là bạn có thể tham gia khi đang đua nhé.',
 'Xin chào {name}! Dù ở đâu, mình cũng có thể cùng hướng về quê nhà. Bạn chọn tỉnh nào hôm nay?'
 ]},
 followThanks:{label:'Cảm ơn theo dõi thật',lines:[
 'Cảm ơn {name} đã theo dõi Mai Trường! Mời bạn cùng ở lại gọi tên quê hương nhé.',
 '{name} vừa theo dõi phòng, cảm ơn bạn! Mong những cuộc gặp ở đây giúp người xa quê thấy gần nhau hơn.',
 'Cảm ơn lượt theo dõi của {name}. Chúc bạn luôn mang theo một chút ấm áp của quê nhà!'
 ]},
 shareThanks:{label:'Cảm ơn chia sẻ thật',lines:[
 'Cảm ơn {name} đã chia sẻ LIVE! Biết đâu nhờ bạn, mình lại gặp thêm một người đồng hương.',
 '{name} vừa gửi cuộc hội ngộ này tới bạn bè, cảm ơn bạn đã nối thêm một nhịp cầu về quê!',
 'Cảm ơn {name} đã chia sẻ. Mời những đồng hương mới ghé cùng bình luận tên quê nhé.'
 ]},
 likeThanks:{label:'Cảm ơn thả tim thật',lines:[
 'Cảm ơn những trái tim của {name}! Tình cảm này mình cùng gửi về quê hương nhé.',
 '{name} đang gửi tim cho phòng, cảm ơn bạn! Mời bạn gọi thêm tên quê để cùng thắp đèn nhé.',
 'Nhận được tim từ {name} rồi! Cảm ơn bạn đã giữ không khí ấm áp cho cả nhà.'
 ]},
 giftKindness:{label:'Nhắc tham gia miễn phí',lines:[
 'Quà là lời cổ vũ tự nguyện. Chỉ bình luận tên tỉnh thôi, bạn cũng đã góp vui và có thể thắp đèn khi đang đua rồi nhé.',
 'Bạn không cần tặng quà mới được xuất hiện. Mỗi lời gọi quê đúng tên đều được chào đón ở đây.',
 'Cảm ơn cả người tặng quà lẫn người góp bình luận. Mỗi cách tiếp sức đều có ý nghĩa với cuộc hội ngộ này.'
 ]},
 lateJoin:{label:'Tham gia khi vòng gần hết',lines:[
 '{name} vừa về cùng {province} trong đoạn cuối! Vẫn kịp góp một lời điểm danh cho quê mình nhé.',
 'Chào {name}, cuộc đua còn {seconds} giây. Ánh đèn {province} đang đón bạn rồi!',
 'Dù chỉ còn ít thời gian, lời gọi {province} của {name} vẫn được ghi nhận. Quê mình cùng vui đến cuối vòng nhé.'
 ]}
};
export const extraExisting={
 firstLight:[
 'Cảm ơn {name}! {province} vừa có ánh đèn đầu tiên. Người con quê mình đang xem, vào chào đồng hương nào!',
 '{province} đã sáng rồi! Một lời điểm danh của {name} vừa đưa quê mình lên bản đồ cuộc hội ngộ.',
 'Mời cả phòng gửi lời chào về {province}! {name} vừa mở ánh đèn cho quê nhà.',
 'Ánh đèn {province} đã lên, cảm ơn {name}. Quê mình ở đâu cũng có người nhớ tới!',
 '{name} vừa gọi tên {province}. Từ khoảnh khắc này, quê mình đã có một vị trí sáng trên bản đồ!',
 'Cả nhà nhìn {province} nhé! Ánh đèn đầu tiên đến từ {name}, đồng hương mình vào cùng cho ấm nào!'
 ],
 comment:[
 '{province} nhận thêm {points} điểm từ {name}. Cảm ơn bạn đã giữ nhịp cho quê nhà!',
 'Một lời gọi quê nữa từ {name}: {province} hiện có {score} điểm rồi!',
 'Cảm ơn {name}, mình vừa ghi thêm {points} điểm cho {province}. Mỗi lời điểm danh đều đáng quý.',
 '{name} đang cùng đồng hương giữ sáng {province}. Quê mình đã có {score} điểm!',
 '{province} lại được nhắc tên bởi {name}! Cộng thêm {points} điểm, cùng vui với quê mình nhé.'
 ],
 gift:[
 '{name} gửi {gift} nhân {quantity} về {province}, cộng {points} điểm. Cảm ơn tấm lòng hướng về quê nhà!',
 'Quê {province} vừa nhận {points} điểm từ món {gift} của {name}. Cả hội gửi lời cảm ơn nào!',
 'Cảm ơn {name} đã cổ vũ {province} bằng {gift}! Điểm quê mình lúc này là {score}.',
 'Một lời chúc qua món {gift} từ {name}: {province} thêm {points} điểm. Cảm ơn bạn đã cùng giữ lửa quê hương!'
 ],
 milestone:[
 '{lit} trên {total} tỉnh đã sáng đèn. Cảm ơn cả nhà đã mang từng miền quê về chung một bản đồ!',
 'Mình vừa đi qua mốc {lit} tỉnh bừng sáng! Còn {dark} quê đang đợi đồng hương mở lời.',
 'Ánh đèn đã đến {lit} tỉnh rồi! Ai đang xem mà quê còn chưa sáng, gõ tên tỉnh để cùng gặp nhau nhé.'
 ],
 idle:[
 'Cả nhà đang ngắm quê nào vậy? Mình cùng bình luận tên tỉnh để gặp đồng hương nhé.',
 'Bạn còn ngại chưa điểm danh à? Không cần quà đâu, tên quê của bạn là đủ để bắt đầu câu chuyện.',
 'Mời người đang xem lặng lẽ cũng gọi tên quê một lần. Biết đâu cả hội đồng hương đang chờ bạn đó!',
 'Xa quê là nhớ một giọng nói thân quen. Mời bạn bình luận tên tỉnh, cùng tìm những người chung miền nhớ nhé.'
 ],
 winner:[
 'Vòng đua khép lại, {province} dẫn đầu với {score} điểm! Cảm ơn tất cả các quê đã cùng tham gia, mời cả phòng về thăm quê thắng nhé.',
 'Xin chúc mừng đồng hương {province}, {score} điểm! Mình cùng dành ít phút ngắm quê nhà và gửi lời chúc tới nhau nào.',
 '{province} là quê thắng vòng này với {score} điểm. Dù quê nào về trước, cả nhà vẫn cùng chung một niềm vui sum họp!'
 ],
 winnerVisit:[
 'Chuyến trở về {province} bắt đầu nhé cả nhà. {intro}',
 'Mời đồng hương cùng ngắm {province}, quê thắng cuộc vừa rồi. {intro}',
 'Xin gửi lời chúc mừng về {province}. Trước khi xem clip, mình cùng nghe đôi nét về quê nhà. {intro}'
 ],
 waiting:[
 'Đã nhận lời chọn quê {province} của {name}. Khi vòng mở, bạn bình luận tiếp để quê mình được cộng điểm nhé.',
 'Chào {name}, đồng hương {province}! Mình đang chờ vòng mới, bạn ở lại cùng hội quê mình nhé.',
 'Cảm ơn {name} đã điểm danh {province}. Vòng chưa mở nên mình giữ lựa chọn quê, chưa cộng điểm lúc này nhé.'
 ]
};
