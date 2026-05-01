    useEffect(() => {
    dispatch(fetchPosts(secureLocalStorage.getItem("token")));
  }, []);
  const { posts } = useAppSelector((store) => store.posts);
