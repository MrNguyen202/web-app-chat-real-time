import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SectionList, FlatList } from "react-native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { hp, wp } from "../../helpers/common"
import { theme } from "../../constants/theme";
import Icon from "../../assets/icons";
import { getConversations, getConversationsGroup } from "../../api/conversationAPI";
import OfficialAccount from "../../assets/dataLocals/OfficialAccount";
import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from "expo-router";
import { getFriendRequests, getFriends } from "../../api/friendshipAPI"
import { useAuth } from "../../contexts/AuthContext";
import Avatar from "../../components/Avatar";
import socket from "../../utils/socket";

const PhoneBookScreen = () => {
  const [typeContact, setTypeContact] = useState("friends");
  const handelTypeContact = (type) => {
    setTypeContact(type);
  }
  return (
    <View style={styles.container}>
      <View style={styles.boxTypeContact}>
        <TouchableOpacity onPress={() => handelTypeContact("friends")} style={typeContact === "friends" ? styles.typeContactActive : styles.typeContactNoActive}>
          <Text style={typeContact === "friends" ? styles.textTypeContactActive : styles.textTypeContact}>Bạn bè</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handelTypeContact("groups")} style={typeContact === "groups" ? styles.typeContactActive : styles.typeContactNoActive}>
          <Text style={typeContact === "groups" ? styles.textTypeContactActive : styles.textTypeContact}>Nhóm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handelTypeContact("OA")} style={typeContact === "OA" ? styles.typeContactActive : styles.typeContactNoActive}>
          <Text style={typeContact === "OA" ? styles.textTypeContactActive : styles.textTypeContact}>OA</Text>
        </TouchableOpacity>
      </View>
      {typeContact === "friends" && <FriendsTabs />}
      {typeContact === "groups" && <GroupsTabs />}
      {typeContact === "OA" && <OATabs />}
    </View>
  );
};

export default PhoneBookScreen;

// LIST FRIENDS
const FriendsTabs = () => {
  const [listFriendRequest, setListFriendRequest] = useState([])
  const [listFriends, setListFriends] = useState([]);
  const { user } = useAuth();

  const [reload, setReload] = useState(0);

  const handleReload = () => {
    setReload(reload + 1);
  }

  //Lấy lời mời kết bạn
  useEffect(() => {
    const fetchFriendRequest = async () => {
      try {
        const response = await getFriendRequests(user?.id);
        if (response.success) {
          setListFriendRequest(response.data);
        } else {
          alert("Lỗi lấy danh sách lời mời kết bạn!");
        }
      } catch (error) {
        console.log("Lỗi lấy danh sách lời mời kết bạn:", error);
      }
    }
    fetchFriendRequest();
  }, []);


  //Lấy danh sách bạn bè
  useFocusEffect(
    useCallback(() => {
      const fetchFriends = async () => {
        try {
          const response = await getFriends(user?.id);
          if (response.success) {
            setListFriends(response.data);
          } else {
            alert("Lỗi lấy danh sách bạn bè!");
          }
        } catch (error) {
          console.log("Lỗi lấy danh sách bạn bè:", error);
        }
      }
      fetchFriends();
    }, [user, reload])
  );

  useEffect(() => {
    //Lắng nghe sự kiện đồng ý
    socket.on("friend-request-accepted", (data) => {
      handleReload();
    });

    //Lắng nghe sự kiện từ chối
    socket.on("friend-request-rejected", (data) => {
      handleReload();
    });

    // Cleanup khi component unmount
    return () => {
      socket.off("friend-request-accepted");
      socket.off("friend-request-rejected");
    };
  }, []);

  // State để chọn loại danh sách bạn bè
  const [typeListFriend, setTypeListFriend] = useState("all");

  const handelTypeListFriend = (type) => {
    setTypeListFriend(type);
  }

  // Nhóm bạn bè theo chữ cái đầu tiên
  const groupUsersByFirstLetter = (listFriends) => {
    const grouped = listFriends.reduce((acc, friend) => {
      const firstLetter = friend.name[0].toUpperCase(); // Lấy chữ cái đầu tiên
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(friend);
      return acc;
    }, {});

    // Chuyển đổi object thành mảng để sử dụng với SectionList
    return Object.keys(grouped)
      .sort() // Sắp xếp theo thứ tự ABC
      .map((letter) => ({
        title: letter,
        data: grouped[letter],
      }));
  };
  const friends = useMemo(() => groupUsersByFirstLetter(listFriends), [listFriends]);


  // Router
  const router = useRouter();

  //Handle to chat detail
  const handleChatDetail = (friend) => {
    router.push({ pathname: "chatDetailScreen", params: { type: "private", data: JSON.stringify(friend) } });
  }

  return (
    <ScrollView>
      <View style={styles.listFriendContainer}>
        <View>
          <TouchableOpacity style={styles.feature} onPress={() => router.push("friendRequest")}>
            <View style={styles.boxIconFeature}>
              <Icon name="userMultiple" size={32} strokeWidth={1.6} color="#FFF" />
            </View>
            <Text style={{ fontSize: 16 }}>Lời mời kết bạn ({listFriendRequest.reduce((count, month) => count + month.data.length, 0)})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.feature}>
            <View style={styles.boxIconFeature}>
              <Icon name="contact" size={32} strokeWidth={1.6} color="#FFF" />
            </View>
            <View>
              <Text style={{ fontSize: 16 }}>Danh bạ máy</Text>
              <Text style={{ fontSize: 12, color: theme.colors.textLight }}>Các liên hệ có dùng Yalo</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.feature}>
            <View style={styles.boxIconFeature}>
              <Icon name="birthdayCake" size={32} strokeWidth={1.6} color="#FFF" />
            </View>
            <Text style={{ fontSize: 16 }}>Sinh nhật</Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: theme.colors.gray, height: hp(1.5) }} />

        <View style={styles.boxListFriend}>
          <TouchableOpacity onPress={() => handelTypeListFriend("all")} style={styles.typeList}>
            <Text style={typeListFriend === 'all' ? styles.textTypeListActive : styles.textTypeListNoActive}>Tất cả ({listFriends?.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handelTypeListFriend("online")} style={styles.typeList}>
            <Text style={typeListFriend === 'online' ? styles.textTypeListActive : styles.textTypeListNoActive}>Mới truy cập ()</Text>
          </TouchableOpacity>
        </View>

        <SectionList
          sections={friends}
          scrollEnabled={false}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.buttonFriend} onPress={() => handleChatDetail(item)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Avatar uri={item.avatar} size={hp(6)} rounded={theme.radius.xxl * 100} style={styles.avatar} />
                <Text style={styles.textNameFriend}>{item.name}</Text>
              </View>
              <View style={styles.boxContactMethod}>
                <TouchableOpacity>
                  <Icon name="phone" size={28} strokeWidth={1.6} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Icon name="callVideoOn" size={28} strokeWidth={1.6} color="gray" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={{ fontSize: 16, fontWeight: 'bold', paddingHorizontal: 20, paddingVertical: 5 }}>{title}</Text>
          )}
        />
      </View>
    </ScrollView>
  )
}

// List groups
const GroupsTabs = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);

  // Format time
  const formatTime = (messageTime) => {
    const diff = (Date.now() - new Date(messageTime)) / 1000;

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
    if (diff < 604800) return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][new Date(messageTime).getDay()];

    const date = new Date(messageTime);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Lấy danh sách nhóm
  useFocusEffect(
    useCallback(() => {
      const fecthGroups = async () => {
        try {
          const response = await getConversationsGroup(user?.id);
          if (response.success) {
            setGroups(response.data);
          } else {
            console.log("Lỗi lấy danh sách nhóm!");
          }
        } catch (error) {
          console.log("Lỗi lấy danh sách nhóm:", error);
        }
      }
      fecthGroups();
    }, [user])
  );

  // Tạo nhóm chat
  const handleGroup = (item) => {
    router.push({ pathname: "chatDetailScreen", params: { type: "group", converId: item } })
  }

  // Router
  const router = useRouter();

  return (
    <ScrollView>
      <TouchableOpacity style={styles.createGroup} onPress={() => router.push("newGroup")}>
        <View style={styles.boxIconAddGroup}>
          <Icon name="addGroup" size={32} strokeWidth={1.6} color={theme.colors.primaryDark} />
        </View>
        <Text style={styles.textCreateGroup}>Tạo nhóm mới</Text>
      </TouchableOpacity>

      <FlatList
        data={groups}
        keyExtractor={(item) => item._id.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.buttonGroup} onPress={() => handleGroup(item?._id)}>
            {item.avatar === null || item.avatar === "" ?
              (item.members.length === 3 ?
                <View style={[styles.containerAvatar3, { width: 50, height: 50 }]}>
                  <Avatar
                    style={[styles.avatar3, styles.top3]}
                    uri={item?.members[0].avatar} />
                  <Avatar
                    style={[styles.avatar3, styles.bottomLeft3]}
                    uri={item?.members[1].avatar} />
                  <Avatar
                    style={[styles.avatar3, styles.bottomRight3]}
                    uri={item?.members[2].avatar} />
                </View>
                :
                <View style={[styles.containerAvatar4, { width: 60, height: 60 }]}>
                  <Avatar
                    style={[styles.avatar4, styles.topLeft4]}
                    uri={item.members[0].avatar} />
                  <Avatar
                    style={[styles.avatar4, styles.topRight4]}
                    uri={item.members[1].avatar} />
                  <Avatar
                    style={[styles.avatar4, styles.bottomLeft4]}
                    uri={item.members[2].avatar} />
                  {item.members.length > 4 ? (
                    <View style={styles.moreContainer4}>
                      <Text style={styles.moreText4}>+{item.members.length - 3}</Text>
                    </View>
                  ) : (
                    <Avatar
                      style={[styles.avatar4, styles.bottomRight4]}
                      uri={item.members[3].avatar} />
                  )}
                </View>
              ) : (
                <Image
                  style={styles.avatarGroup}
                  source={{ uri: item.avatar }}
                />
              )}
            <View style={styles.boxContentButton}>
              <View style={styles.boxNameGroup}>
                <Text style={styles.textNameGroup} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                {!item.lastMessage ? <Text style={styles.textTimeGroup}>{formatTime(item?.createdAt)}</Text> : <Text style={styles.textTimeGroup}>{formatTime(item?.lastMessage?.createdAt)}</Text>}
              </View>
              <Text style={styles.textMessage} numberOfLines={1} ellipsizeMode="tail">{(item?.lastMessage?.content)}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <View>
            <View style={{ height: hp(1.5), backgroundColor: theme.colors.gray }} />
            <View style={styles.headerListComponent}>
              <Text style={styles.textHeaderListGroup}>Nhóm đang tham gia ({groups.length})</Text>
              <TouchableOpacity style={styles.featureSort}>
                <Icon name="sort" size={24} strokeWidth={1.6} color="gray" />
                <Text style={styles.textFeatureSort}>Sắp xếp</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  )
}

//List Official Account
const OATabs = () => {
  // Router
  const router = useRouter();

  return (
    <ScrollView>
      <View style={styles.listOAContainer}>
        <TouchableOpacity style={styles.boxSearchOA} onPress={() => router.push("searchOA")}>
          <LinearGradient style={styles.iconCellular}
            colors={['#CC6CE7', '#023986']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1.2 }}
            locations={[0, 1]}
          >
            <Icon name="cellular" size={32} strokeWidth={1.6} color="white" />
          </LinearGradient>
          <Text style={styles.textSearchOA}>Tìm kiếm Official Account</Text>
        </TouchableOpacity>
        <FlatList
          data={OfficialAccount}
          scrollEnabled={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.buttonOA}>
              <Image style={styles.avatarOA} source={{ uri: item.avatar }} />
              <Text style={styles.textNameOA} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
            </TouchableOpacity>
          )}
          ListHeaderComponent={() => (
            <View>
              <View style={{ height: hp(1.5), backgroundColor: theme.colors.gray }} />
              <Text style={styles.textTitleOfficialed}>Official Account đã quan tâm</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxTypeContact: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: hp(6),
    borderColor: theme.colors.gray,
    borderBottomWidth: 1,
    width: "100%",
  },
  textTypeContact: {
    fontSize: 16,
    color: theme.colors.textLight,
  },
  textTypeContactActive: {
    color: theme.colors.text,
    fontWeight: theme.fonts.bold,
    fontSize: 16
  },
  typeContactNoActive: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
    paddingBottom: 2,
  },
  typeContactActive: {
    borderBottomWidth: 2,
    borderColor: theme.colors.primary,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
  },

  // tabs friend
  listFriendContainer: {
    flex: 1,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(7),
  },
  boxIconFeature: {
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    padding: 5,
    margin: 20
  },
  boxListFriend: {
    height: hp(8),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: theme.colors.gray,
    borderBottomWidth: 1
  },
  typeList: {
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(4),
    paddingHorizontal: 20,
    backgroundColor: theme.colors.gray,
    borderRadius: 20,
    marginLeft: 20
  },
  textTypeListActive: {
    fontSize: 14,
    fontWeight: theme.fonts.bold
  },
  textTypeListNoActive: {
    fontSize: 14,
  },

  // Component friend
  buttonFriend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20
  },
  textNameFriend: {
    fontSize: 16,
  },
  boxContactMethod: {
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(20)
  },

  // tabs group
  createGroup: {
    height: hp(10),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  boxIconAddGroup: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.gray,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCreateGroup: {
    fontSize: 16,
    marginLeft: 20
  },
  headerListComponent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp(6),
    paddingHorizontal: 20,
  },
  featureSort: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHeaderListGroup: {
    fontSize: 15,
  },
  textFeatureSort: {
    fontSize: 15,
    color: "gray"
  },

  // button group
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    paddingLeft: 20,
    height: hp(9),
  },
  textTimeGroup: {
    color: "gray",
    fontSize: 14,
    marginBottom: 10
  },
  textNameGroup: {
    fontSize: 18,
    width: "80%"
  },
  textMessage: {
    color: "gray",
    fontSize: 16,
    width: "90%"
  },
  boxContentButton: {
    width: wp(75),
    height: "100%",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray,
    justifyContent: 'center',
  },
  avatarGroup: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  boxNameGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15
  },

  // Avatar group 3 người
  containerAvatar3: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatar3: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
  },
  top3: {
    top: "-10%",
    left: "50%",
    transform: [{ translateX: -16 }],
  },
  bottomLeft3: {
    bottom: "-5%",
    left: "-5%",
  },
  bottomRight3: {
    bottom: "-5%",
    right: "-5%",
  },

  // Avatar group 4 người
  containerAvatar4: {
    position: "relative",
  },
  avatar4: {
    width: 32,
    height: 32,
    borderRadius: 20,
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
  },
  topLeft4: {
    top: "2%",
    left: "2%",
  },
  topRight4: {
    top: "2%",
    right: "2%",
  },
  bottomLeft4: {
    bottom: "2%",
    left: "2%",
  },
  bottomRight4: {
    bottom: "2%",
    right: "2%",
  },
  moreContainer4: {
    position: "absolute",
    bottom: "2%",
    right: "2%",
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#bbb",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  moreText4: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  // List Official Account
  listOAContainer: {
    flex: 1,
  },
  iconCellular: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxSearchOA: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textSearchOA: {
    fontSize: 16,
    marginLeft: 20
  },
  buttonOA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: hp(9),
  },
  avatarOA: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  textNameOA: {
    fontSize: 18,
    marginLeft: 20,
    width: "80%"
  },
  textTitleOfficialed: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontWeight: "bold"
  }
});