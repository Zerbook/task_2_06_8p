import { Routes, Route, NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import styles from './app.module.css';
import { useState, useEffect } from 'react';

const database = {
	productList: [
		{ id: 1, name: 'Телевизор' },
		{ id: 2, name: 'Смартфон' },
		{ id: 3, name: 'Планшет' },
	],
	products: {
		1: { id: 1, name: 'Телевизор', price: 29900, amout: 15 },
		2: { id: 2, name: 'Смартфон', price: 13900, amout: 48 },
		3: { id: 3, name: 'Планшет', price: 18400, amout: 23 },
	},
};

const LOADING_TIMEOUT = 3000;

const fetchProductList = () => database.productList;

const fetchProduct = (id) =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve(database.products[id]);
		}, 2500);
	});

const MainPage = () => <div>Контент главной страницы</div>;
const Catalog = () => (
	<div>
		<h3>Каталог товаров</h3>
		<ul>
			{fetchProductList().map(({ id, name }) => (
				<li key={id}>
					<NavLink to={`product/${id}`}>{name}</NavLink>
				</li>
			))}
		</ul>
		<Outlet />
	</div>
);

const ProductNotFound = () => <div>Такой товар не существует</div>;
const ProductLoadError = () => (
	<div>Ошибка загрузки товара, попробуйте ещё раз позднее</div>
);
const Product = () => {
	const [product, setProduct] = useState(null);
	const params = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		let isLoadingTimeout = false;
		let isProductLoaded = false;

		setTimeout(() => {
			isLoadingTimeout = true;

			if (!isProductLoaded) {
				navigate('/product-load-error', { replace: true });
			}
		}, LOADING_TIMEOUT);

		fetchProduct(params.id).then((loadedProduct) => {
			isProductLoaded = true;

			if (!isLoadingTimeout) {
				if (!loadedProduct) {
					navigate('/product-not-exist');
					return;
				}
				setProduct(loadedProduct);
			}
		});
	}, [params.id, navigate]);

	if (!product) {
		return null;
	}

	const { name, price, amout } = product;
	return (
		<div>
			<h3>Товар - {name}</h3>
			<div>Цена: {price}</div>
			<div>На складе: {amout}</div>
		</div>
	);
};
const Contacts = () => <div>Контент контактов</div>;
const NotFound = () => <div>Такая страница не существует</div>;

const ExtendedLink = ({ to, children }) => (
	<NavLink to={to}>
		{({ isActive }) =>
			isActive ? (
				<>
					<span>{children}</span>
					<span>*</span>
					<span children="*" />
				</>
			) : (
				children
			)
		}
	</NavLink>
);

const App = () => {
	return (
		<div className={styles.app}>
			<div>
				<h3>Меню</h3>
				<ul>
					<li>
						<ExtendedLink to="/">Главное</ExtendedLink>
					</li>
					<li>
						<ExtendedLink to="/catalog">Каталог</ExtendedLink>
					</li>
					<li>
						<ExtendedLink to="/contacts">Контакты</ExtendedLink>
					</li>
				</ul>
			</div>
			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="/catalog" element={<Catalog />}>
					<Route path="product/:id" element={<Product />} />
					<Route path="service/:id" element={<Product />} />
				</Route>
				<Route path="/contacts" element={<Contacts />} />
				<Route path="/product-load-error" element={<ProductLoadError />} />
				<Route path="/product-not-exist" element={<ProductNotFound />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
};
export default App;

//4:45
